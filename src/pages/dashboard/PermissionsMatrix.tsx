/**
 * Page d'administration pour visualiser la matrice des permissions
 * Accessible uniquement aux responsables district
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getPermissionMatrix, Resource, Action } from "@/lib/permissions";
import { UserRole } from "@/data/mockData";
import { Check, X } from "lucide-react";
import { RoleGuard } from "@/components/PermissionGuard";

const RESOURCES = Object.values(Resource);
const ACTIONS = Object.values(Action);

export default function PermissionsMatrix() {
  const matrix = getPermissionMatrix();

  const roleLabels: Record<UserRole, string> = {
    sage_femme: "Sage-femme",
    responsable_structure: "Responsable Structure",
    responsable_district: "Responsable District",
    partenaire_ong: "Partenaire ONG",
    partenaire_regional: "Partenaire Régional",
    partenaire_gouvernemental: "Partenaire Gouvernemental",
  };

  const scopeLabels = {
    own: "Propres données",
    structure: "Structure entière",
    district: "District entier",
    region: "Région entière",
    national: "National",
    anonymous: "Données anonymisées",
  };

  const hasPermission = (role: UserRole, resource: Resource, action: Action): boolean => {
    const permission = `${resource}:${action}`;
    return matrix[role].permissions.includes(permission as any);
  };

  return (
    <RoleGuard allowedRoles={["responsable_district"]} fallback={
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Seuls les responsables de district peuvent accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    }>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Matrice des permissions</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble des permissions et scopes par rôle
          </p>
        </div>

        {/* Résumé des scopes */}
        <Card>
          <CardHeader>
            <CardTitle>Scopes d'accès par rôle</CardTitle>
            <CardDescription>
              Le scope définit l'étendue des données accessibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(matrix).map(([role, config]) => (
                <div key={role} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{roleLabels[role as UserRole]}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {scopeLabels[config.scope]}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {config.permissions.length} permissions
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Matrice détaillée par ressource */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions détaillées</CardTitle>
            <CardDescription>
              Actions autorisées par rôle et par ressource
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {RESOURCES.map((resource) => (
                <div key={resource}>
                  <h3 className="text-lg font-semibold mb-3 capitalize">{resource}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rôle</TableHead>
                          {ACTIONS.map((action) => (
                            <TableHead key={action} className="text-center capitalize">
                              {action}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(matrix).map((role) => (
                          <TableRow key={role}>
                            <TableCell className="font-medium">
                              {roleLabels[role as UserRole]}
                            </TableCell>
                            {ACTIONS.map((action) => (
                              <TableCell key={action} className="text-center">
                                {hasPermission(role as UserRole, resource, action) ? (
                                  <Check className="h-5 w-5 text-green-600 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Légende */}
        <Card>
          <CardHeader>
            <CardTitle>Légende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Permission accordée</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-gray-300" />
                <span>Permission refusée</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
