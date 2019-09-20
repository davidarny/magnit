import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marketplace } from "../entities/marketplace.entity";

interface IRegionDto {
    region: string;
}

interface ICityDto {
    city: string;
}

@Injectable()
export class MarketplaceService {
    constructor(
        @InjectRepository(Marketplace)
        private readonly marketplaceRepository: Repository<Marketplace>,
    ) {}

    async getAllRegions(): Promise<string[]> {
        const results = await this.marketplaceRepository.query(`
            SELECT m.region AS region
            FROM marketplace m
            GROUP BY m.region
            ORDER BY m.region
        `);
        if (!results) {
            return [];
        }
        return this.tableToArray<IRegionDto, string>(results, curr => curr.region);
    }

    async getCitiesForRegion(region: string): Promise<string[]> {
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
        return this.tableToArray<ICityDto, string>(results, curr => curr.city);
    }

    private tableToArray<T, R>(table: T[], predicate: (curr: T) => string): R[] {
        return table.reduce((prev, curr) => {
            if (prev.includes(predicate(curr))) {
                return prev;
            }
            return [...prev, predicate(curr)];
        }, []);
    }
}
