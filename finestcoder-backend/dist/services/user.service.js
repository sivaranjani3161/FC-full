"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const UserStatus_1 = require("../entities/enums/UserStatus");
const http_1 = require("../utils/http");
const string_1 = require("../utils/string");
const userSelect = {
    id: true,
    email: true,
    name: true,
    status: true,
    authProvider: true,
    roleId: true,
    createdAt: true,
    role: { id: true, name: true, code: true },
};
class UserService {
    userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    async list() {
        return this.userRepo.find({
            relations: ["role"],
            order: { createdAt: "DESC" },
            select: userSelect,
        });
    }
    async getByEmail(email) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ["role", "role.permissions"],
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                roleId: true,
                role: {
                    id: true,
                    name: true,
                    code: true,
                    permissions: { id: true, code: true, name: true },
                },
            },
        });
        if (!user)
            throw new http_1.HttpError("User not found", 404);
        return user;
    }
    async create(input) {
        const email = (0, string_1.normalizeEmail)(input.email);
        const name = input.name.trim();
        const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
        if (!role)
            throw new http_1.HttpError("Role not found", 400);
        const existing = await this.userRepo.findOne({ where: { email } });
        if (existing)
            throw new http_1.HttpError("User already exists", 409);
        const user = this.userRepo.create({
            email,
            name,
            roleId: input.roleId,
            status: UserStatus_1.UserStatus.ACTIVE,
            authProvider: "google",
            password: null,
            oauthId: null,
            inviteToken: null,
            inviteExpiresAt: null,
        });
        const saved = await this.userRepo.save(user);
        return { ...saved, role };
    }
    async update(id, input) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new http_1.HttpError("User not found", 404);
        if (input.roleId !== undefined) {
            const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
            if (!role)
                throw new http_1.HttpError("Role not found", 400);
            user.roleId = input.roleId;
        }
        if (input.name !== undefined)
            user.name = input.name.trim();
        if (input.email !== undefined) {
            const email = (0, string_1.normalizeEmail)(input.email);
            const existing = await this.userRepo.findOne({ where: { email } });
            if (existing && existing.id !== id)
                throw new http_1.HttpError("Email already in use", 409);
            user.email = email;
        }
        if (input.status !== undefined)
            user.status = input.status;
        await this.userRepo.save(user);
        const withRole = await this.userRepo.findOne({
            where: { id },
            relations: ["role"],
            select: userSelect,
        });
        return withRole;
    }
    async remove(id) {
        const result = await this.userRepo.delete(id);
        if (result.affected === 0)
            throw new http_1.HttpError("User not found", 404);
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
