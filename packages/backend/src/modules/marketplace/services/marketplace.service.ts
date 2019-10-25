import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { Marketplace } from "../entities/marketplace.entity";

interface IRegionDto {
    region: string;
}

interface ICityDto {
    city: string;
}

interface IFormatDto {
    format: string;
}

interface IAddressDto {
    address: string;
}

@Injectable()
export class MarketplaceService {
    constructor(
        @InjectRepository(Marketplace)
        private readonly marketplaceRepository: Repository<Marketplace>,
    ) {}

    @Transactional()
    async findAll() {
        return this.marketplaceRepository.find();
    }

    @Transactional()
    async findAllRegions(): Promise<string[]> {
        const results = await this.marketplaceRepository.query(`
            SELECT m.region AS region
            FROM marketplace m
            GROUP BY m.region
            ORDER BY m.region
        `);
        if (!results) {
            return [];
        }
        return this.toArray<IRegionDto, string>(results, curr => curr.region);
    }

    @Transactional()
    async findCitiesForRegion(region: string): Promise<string[]> {
        const results = await this.marketplaceRepository.query(
            `
            SELECT m.city AS city
            FROM marketplace m
            WHERE m.region = $1
            GROUP BY m.region, m.city
            ORDER BY m.region, m.city
        `,
            [region],
        );
        if (!results) {
            return [];
        }
        return this.toArray<ICityDto, string>(results, curr => curr.city);
    }

    @Transactional()
    async findFormatForCity(region: string, city: string): Promise<string[]> {
        const results = await this.marketplaceRepository.query(
            `
            SELECT m.format AS format
            FROM marketplace m
            WHERE m.region = $1 AND m.city = $2
            GROUP BY m.region, m.format
            ORDER BY m.region, m.format
        `,
            [region, city],
        );
        if (!results) {
            return [];
        }
        return this.toArray<IFormatDto, string>(results, curr => curr.format);
    }

    @Transactional()
    async findAddressForFormat(region: string, city: string, format: string): Promise<string[]> {
        const results = await this.marketplaceRepository.query(
            `
            SELECT m.address AS address
            FROM marketplace m
            WHERE m.region = $1 AND m.city = $2 AND m.format = $3
            GROUP BY m.region, m.address
            ORDER BY m.region, m.address
        `,
            [region, city, format],
        );
        if (!results) {
            return [];
        }
        return this.toArray<IAddressDto, string>(results, curr => curr.address);
    }

    @Transactional()
    async findOne(
        region: string,
        city: string,
        format: string,
        address: string,
    ): Promise<Marketplace | undefined> {
        return this.marketplaceRepository.findOne({ where: { region, city, format, address } });
    }

    private toArray<T, R>(table: T[], predicate: (curr: T) => string): R[] {
        return table.reduce((prev, curr) => {
            if (prev.includes(predicate(curr))) {
                return prev;
            }
            return [...prev, predicate(curr)];
        }, []);
    }
}
