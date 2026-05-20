"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryService = exports.EnquiryService = void 0;
const data_source_1 = require("../config/data-source");
const Enquiry_1 = require("../entities/Enquiry");
const http_1 = require("../utils/http");
const string_1 = require("../utils/string");
class EnquiryService {
    repo = data_source_1.AppDataSource.getRepository(Enquiry_1.Enquiry);
    async list() {
        return this.repo.find({
            relations: ["course"],
            order: { createdAt: "DESC" },
        });
    }
    async getById(id) {
        const enquiry = await this.repo.findOne({ where: { id }, relations: ["course"] });
        if (!enquiry)
            throw new http_1.HttpError("Enquiry not found", 404);
        return enquiry;
    }
    async create(input) {
        const enquiry = this.repo.create({
            fullName: input.fullName.trim(),
            email: (0, string_1.normalizeEmail)(input.email),
            phone: input.phone ?? null,
            message: input.message ?? null,
            courseId: input.courseId ?? null,
            status: input.status,
        });
        return this.repo.save(enquiry);
    }
    async update(id, input) {
        const enquiry = await this.repo.findOne({ where: { id } });
        if (!enquiry)
            throw new http_1.HttpError("Enquiry not found", 404);
        if (input.fullName !== undefined)
            enquiry.fullName = input.fullName.trim();
        if (input.email !== undefined)
            enquiry.email = (0, string_1.normalizeEmail)(input.email);
        if (input.phone !== undefined)
            enquiry.phone = input.phone ?? null;
        if (input.message !== undefined)
            enquiry.message = input.message ?? null;
        if (input.courseId !== undefined)
            enquiry.courseId = input.courseId ?? null;
        if (input.status !== undefined)
            enquiry.status = input.status;
        return this.repo.save(enquiry);
    }
    async remove(id) {
        const enquiry = await this.repo.findOne({ where: { id } });
        if (!enquiry)
            throw new http_1.HttpError("Enquiry not found", 404);
        await this.repo.remove(enquiry);
        return { success: true };
    }
}
exports.EnquiryService = EnquiryService;
exports.enquiryService = new EnquiryService();
