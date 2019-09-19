import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Marketplace } from "../entities/marketplace.entity";

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
        return results.reduce((prev, curr) => {
            if (prev.includes(curr.region)) {
                return prev;
            }
            return [...prev, curr.region];
        }, []);
    }
}
