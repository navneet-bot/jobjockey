"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRoleSchema, AdminRoleFormValues } from "@/lib/validators";
import { getAdminRoles, upsertAdminRole, deleteAdminRole } from "@/actions/adminRoleActions";
import { AdminRole } from "@/lib/schema";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/ui/GradientButton";
import { ShieldCheck, Trash2, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminManagementForm() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<AdminRoleFormValues>({
    resolver: zodResolver(adminRoleSchema),
    defaultValues: {
      userId: "",
      role: "admin",
      canManageCompanies: true,
      canManageJobs: true,
      canManageSettings: false,
      canViewApplications: true,
      canManageChat: true,
    },
  });

  const { register, handleSubmit, formState: { isSubmitting, errors }, setValue, watch, reset } = form;

  async function loadRoles() {
    setLoadingRoles(true);
    const data = await getAdminRoles();
    setRoles(data);
    setLoadingRoles(false);
  }

  useEffect(() => {
    loadRoles();
  }, []);

  const onSubmit = async (data: AdminRoleFormValues) => {
    const result = await upsertAdminRole(data);
    if (result.success) {
      toast.success("Admin role saved.");
      reset();
      loadRoles();
    } else {
      toast.error(result.error || "Failed to save role.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteAdminRole(id);
    setDeletingId(null);
    if (result.success) {
      toast.success("Admin role removed.");
      loadRoles();
    } else {
      toast.error(result.error || "Failed to remove role.");
    }
  };

  const PermissionCheckbox = ({
    name,
    label,
  }: {
    name: keyof AdminRoleFormValues;
    label: string;
  }) => {
    const value = watch(name) as boolean;
    return (
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/8 dark:hover:bg-white/10 transition-colors">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => setValue(name, e.target.checked as any)}
          className="w-4 h-4 rounded accent-[#111827] dark:accent-white"
        />
        <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
      </label>
    );
  };

  return (
    <div className="space-y-8">
      {/* Add / Edit Role Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Clerk User ID</Label>
            <Input
              {...register("userId")}
              placeholder="user_2abc..."
              className="bg-background/50"
            />
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Role Name</Label>
            <Input
              {...register("role")}
              placeholder="admin"
              className="bg-background/50"
            />
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Permissions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PermissionCheckbox name="canManageCompanies" label="Manage Companies" />
            <PermissionCheckbox name="canManageJobs" label="Manage Jobs" />
            <PermissionCheckbox name="canManageSettings" label="Manage Settings" />
            <PermissionCheckbox name="canViewApplications" label="View Applications" />
            <PermissionCheckbox name="canManageChat" label="Manage Chat" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <GradientButton type="submit" disabled={isSubmitting} className="px-8">
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving…" : "Add / Update Role"}
          </GradientButton>
        </div>
      </form>

      {/* Existing Roles Table */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Existing Admin Roles</p>
        {loadingRoles ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : roles.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No admin roles configured.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-black/5 dark:bg-white/5 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">User ID</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-center font-medium">Companies</th>
                  <th className="px-4 py-3 text-center font-medium">Jobs</th>
                  <th className="px-4 py-3 text-center font-medium">Settings</th>
                  <th className="px-4 py-3 text-center font-medium">Applications</th>
                  <th className="px-4 py-3 text-center font-medium">Chat</th>
                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-black/3 dark:hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-main)] max-w-[180px] truncate">
                      {role.userId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-black/10 dark:bg-white/10 text-[var(--text-main)]">
                        {role.role}
                      </span>
                    </td>
                    {[role.canManageCompanies, role.canManageJobs, role.canManageSettings, role.canViewApplications, role.canManageChat].map((perm, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        <span className={cn("text-xs font-medium", perm ? "text-green-500" : "text-red-400")}>
                          {perm ? "✓" : "✗"}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(role.id)}
                        disabled={deletingId === role.id}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        title="Remove role"
                      >
                        {deletingId === role.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
