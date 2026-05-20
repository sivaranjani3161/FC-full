"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleService = exports.RoleService = void 0;
const data_source_1 = require("../config/data-source");
const Role_1 = require("../entities/Role");
const User_1 = require("../entities/User");
const Permission_1 = require("../entities/Permission");
const http_1 = require("../utils/http");
class RoleService {
    roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    permRepo = data_source_1.AppDataSource.getRepository(Permission_1.Permission);
    async list() {
        return this.roleRepo.find({ order: { id: "ASC" } });
    }
    async create(input) {
        const role = this.roleRepo.create({
            name: input.name,
            code: input.code,
            description: input.description ?? null,
        });
        return this.roleRepo.save(role);
    }
    async update(id, input) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new http_1.HttpError("Role not found", 404);
        if (role.code === "admin")
            throw new http_1.HttpError("Admin role cannot be edited", 400);
        if (input.description !== undefined)
            role.description = input.description ?? null;
        try {
            return await this.roleRepo.save(role);
        }
        catch (error) {
            if (error?.code === "ER_DUP_ENTRY") {
                throw new http_1.HttpError("Role code already exists", 409);
            }
            throw error;
        }
    }
    async remove(id) {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role)
            throw new http_1.HttpError("Role not found", 404);
        if (role.code === "admin")
            throw new http_1.HttpError("Admin role cannot be deleted", 400);
        const adminRole = await this.roleRepo.findOne({ where: { code: "admin" } });
        if (adminRole) {
            await this.userRepo.update({ roleId: id }, { roleId: adminRole.id });
        }
        await this.permRepo.delete({ roleId: id });
        await this.roleRepo.delete(id);
        return { success: true };
    }
}
exports.RoleService = RoleService;
exports.roleService = new RoleService();
