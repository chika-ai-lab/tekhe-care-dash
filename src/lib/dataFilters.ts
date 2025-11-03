import { User } from '@/data/mockData';
import type { Patient, RisqueIA, ReferenceSonu, Visite } from '@/data/mockData';

/**
 * Filtre les données en fonction du rôle de l'utilisateur
 * - sage_femme: voit uniquement ses propres patients
 * - responsable_structure: voit tous les patients de sa structure
 * - responsable_district: voit tous les patients
 */

export const filterPatientsByUser = (patients: Patient[], user: User | null): Patient[] => {
  if (!user) return [];
  
  // Sage-femme: uniquement ses patients
  if (user.role === 'sage_femme') {
    const userFullName = `${user.prenom} ${user.nom}`;
    return patients.filter(patient => patient.agent === userFullName);
  }
  
  // Responsable structure: tous les patients de sa structure
  if (user.role === 'responsable_structure' && user.structure) {
    return patients.filter(patient => patient.structure === user.structure);
  }
  
  // Responsable district: tous les patients
  if (user.role === 'responsable_district') {
    return patients;
  }
  
  // Par défaut, aucun accès
  return [];
};

export const filterRisquesByUser = (risques: RisqueIA[], patients: Patient[], user: User | null): RisqueIA[] => {
  if (!user) return [];
  
  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map(p => p.id));
  
  return risques.filter(risque => patientIds.has(risque.patient_id));
};

export const filterReferencesByUser = (references: ReferenceSonu[], patients: Patient[], user: User | null): ReferenceSonu[] => {
  if (!user) return [];
  
  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map(p => p.id));
  
  return references.filter(ref => patientIds.has(ref.patient_id));
};

export const filterVisitesByUser = (visites: Visite[], patients: Patient[], user: User | null): Visite[] => {
  if (!user) return [];
  
  const filteredPatients = filterPatientsByUser(patients, user);
  const patientIds = new Set(filteredPatients.map(p => p.id));
  
  return visites.filter(visite => patientIds.has(visite.patient_id));
};
