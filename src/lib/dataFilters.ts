import { User } from "@/data/mockData";
import type { Patient, RisqueIA, ReferenceSonu, Visite } from "@/data/mockData";
import { canAccessData, getPermissionScope, PermissionScope } from "./permissions";

/**
 * Filtre les données en fonction du rôle de l'utilisateur avec vérification stricte
 * Utilise le système de permissions RBAC pour garantir la sécurité
 *
 * - sage_femme: voit uniquement ses propres patientes (OWN scope)
 * - responsable_structure: voit toutes les patientes de sa structure (STRUCTURE scope)
 * - responsable_district: voit toutes les patientes de son district (DISTRICT scope)
 * - partenaires: aucun accès aux données individuelles (ANONYMOUS scope)
 */

/**
 * Vérifie si un utilisateur peut accéder à une patiente spécifique
 */
export const canAccessPatient = (patient: Patient, user: User | null): boolean => {
  if (!user) return false;

  const scope = getPermissionScope(user.role);
  const userName = `${user.prenom} ${user.nom}`;

  // Les partenaires n'ont jamais accès aux données individuelles
  if (scope === PermissionScope.ANONYMOUS) {
    return false;
  }

  // Utilise la fonction canAccessData avec vérification stricte
  return canAccessData(
    user.role,
    user.structure,
    user.district,
    user.region,
    patient.structure,
    patient.district,
    patient.region,
    patient.agent,
    userName
  );
};

/**
 * Filtre les patientes selon les permissions de l'utilisateur
 * STRICT: Vérifie que l'utilisateur a les informations nécessaires pour accéder aux données
 */
export const filterPatientsByUser = (patients: Patient[], user: User | null): Patient[] => {
  if (!user) return [];

  const scope = getPermissionScope(user.role);
  const userName = `${user.prenom} ${user.nom}`;

  // Partenaires: aucun accès aux données individuelles
  if (scope === PermissionScope.ANONYMOUS) {
    return [];
  }

  // Sage-femme: uniquement ses propres patientes
  if (scope === PermissionScope.OWN) {
    if (!userName) {
      console.warn("Sage-femme sans nom défini, accès refusé");
      return [];
    }
    return patients.filter((patient) => patient.agent === userName);
  }

  // Responsable structure: toutes les patientes de sa structure
  if (scope === PermissionScope.STRUCTURE) {
    if (!user.structure) {
      console.warn("Responsable structure sans structure définie, accès refusé");
      return [];
    }
    return patients.filter((patient) => patient.structure === user.structure);
  }

  // Responsable district: toutes les patientes de son district
  if (scope === PermissionScope.DISTRICT) {
    if (!user.district) {
      console.warn("Responsable district sans district défini, accès refusé");
      return [];
    }
    return patients.filter((patient) => patient.district === user.district);
  }

  // Niveau régional: toutes les patientes de la région
  if (scope === PermissionScope.REGION) {
    if (!user.region) {
      console.warn("Utilisateur régional sans région définie, accès refusé");
      return [];
    }
    return patients.filter((patient) => patient.region === user.region);
  }

  // Niveau national: toutes les patientes
  if (scope === PermissionScope.NATIONAL) {
    return patients;
  }

  // Par défaut, aucun accès
  console.warn(`Scope inconnu: ${scope}, accès refusé`);
  return [];
};

/**
 * Filtre les risques selon les patientes accessibles
 * Les risques sont liés aux patientes, donc on filtre d'abord les patientes
 */
export const filterRisquesByUser = (
  risques: RisqueIA[],
  patients: Patient[],
  user: User | null
): RisqueIA[] => {
  if (!user) return [];

  // Les partenaires n'ont pas accès aux risques individuels
  const scope = getPermissionScope(user.role);
  if (scope === PermissionScope.ANONYMOUS) {
    return [];
  }

  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map((p) => p.id));

  return risques.filter((risque) => patientIds.has(risque.patient_id));
};

/**
 * Filtre les références selon les patientes accessibles
 */
export const filterReferencesByUser = (
  references: ReferenceSonu[],
  patients: Patient[],
  user: User | null
): ReferenceSonu[] => {
  if (!user) return [];

  const scope = getPermissionScope(user.role);
  if (scope === PermissionScope.ANONYMOUS) {
    return [];
  }

  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map((p) => p.id));

  return references.filter((ref) => patientIds.has(ref.patient_id));
};

/**
 * Filtre les visites selon les patientes accessibles
 */
export const filterVisitesByUser = (
  visites: Visite[],
  patients: Patient[],
  user: User | null
): Visite[] => {
  if (!user) return [];

  const scope = getPermissionScope(user.role);
  if (scope === PermissionScope.ANONYMOUS) {
    return [];
  }

  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map((p) => p.id));

  return visites.filter((visite) => patientIds.has(visite.patient_id));
};

/**
 * Obtient des statistiques agrégées sans exposer de données individuelles
 * Utilisé pour les partenaires qui ont un scope ANONYMOUS
 */
export const getAnonymizedStats = (patients: Patient[]) => {
  return {
    totalPatients: patients.length,
    ageDistribution: {
      moins18: patients.filter((p) => p.age < 18).length,
      entre18et25: patients.filter((p) => p.age >= 18 && p.age <= 25).length,
      entre26et35: patients.filter((p) => p.age > 25 && p.age <= 35).length,
      plus35: patients.filter((p) => p.age > 35).length,
    },
    gestationDistribution: {
      trimestre1: patients.filter((p) => p.semaines && p.semaines <= 12).length,
      trimestre2: patients.filter((p) => p.semaines && p.semaines > 12 && p.semaines <= 26).length,
      trimestre3: patients.filter((p) => p.semaines && p.semaines > 26).length,
    },
  };
};

/**
 * Vérifie qu'un utilisateur a les informations requises pour son scope
 * Utile pour la validation lors de la connexion
 */
export const validateUserScope = (user: User): { valid: boolean; errors: string[] } => {
  const scope = getPermissionScope(user.role);
  const errors: string[] = [];

  if (scope === PermissionScope.STRUCTURE && !user.structure) {
    errors.push("L'utilisateur avec le scope STRUCTURE doit avoir une structure définie");
  }

  if (scope === PermissionScope.DISTRICT && !user.district) {
    errors.push("L'utilisateur avec le scope DISTRICT doit avoir un district défini");
  }

  if (scope === PermissionScope.REGION && !user.region) {
    errors.push("L'utilisateur avec le scope REGION doit avoir une région définie");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
