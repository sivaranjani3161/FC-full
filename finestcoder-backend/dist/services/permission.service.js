"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionService = exports.PermissionService = void 0;
const data_source_1 = require("../config/data-source");
const Permission_1 = require("../entities/Permission");
const Role_1 = require("../entities/Role");
const permissions_1 = require("../constants/permissions");
const http_1 = require("../utils/http");
function buildPermissionMap(perms) {
    const result = {};
    for (const mod of permissions_1.MODULES) {
        result[mod] = {};
        for (const op of permissions_1.OPERATIONS) {
            const code = `${mod}:${op}`;
            result[mod][op] = perms.some((p) => p.code === code);
        }
    }
    return result;
}
class PermissionService {
    permRepo = data_source_1.AppDataSource.getRepository(Permission_1.Permission);
    roleRepo = data_source_1.AppDataSource.getRepository(Role_1.Role);
    async getByRole(roleId) {
        const perms = await this.permRepo.find({ where: { roleId } });
        return buildPermissionMap(perms);
    }
    async replaceForRole(input) {
        const role = await this.roleRepo.findOne({ where: { id: input.roleId } });
        if (!role)
            throw new http_1.HttpError("Role not found", 400);
        await this.permRepo.delete({ roleId: input.roleId });
        const toInsert = [];
        for (const mod of permissions_1.MODULES) {
            for (const op of permissions_1.OPERATIONS) {
                if (input.permissions?.[mod]?.[op]) {
                    const code = `${mod}:${op}`;
                    toInsert.push({
                        roleId: input.roleId,
                        code,
                        name: `${mod} ${op}`,
                        description: null,
                    });
                }
            }
        }
        if (toInsert.length > 0) {
            await this.permRepo.save(this.permRepo.create(toInsert));
        }
        return { success: true, inserted: toInsert.length };
    }
    async getAllGrouped() {
        const roles = await this.roleRepo.find({ relations: ["permissions"] });
        return roles.map((role) => ({
            roleId: role.id,
            roleCode: role.code,
            roleName: role.name,
            permissions: buildPermissionMap(role.permissions),
        }));
    }
}
exports.PermissionService = PermissionService;
exports.permissionService = new PermissionService();
