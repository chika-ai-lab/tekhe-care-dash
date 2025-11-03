import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPatients } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Search, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { PatientCard } from "@/components/PatientCard";
import { useAuth } from "@/contexts/AuthContext";
import { filterPatientsByUser } from "@/lib/dataFilters";

export default function CSU() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrer les patients selon le rôle de l'utilisateur
  const userPatients = filterPatientsByUser(mockPatients, user);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-[hsl(var(--status-vert))] text-white"><CheckCircle className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-[hsl(var(--status-orange))] text-white"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case 'a_renouveler':
        return <Badge className="bg-[hsl(var(--status-rouge))] text-white"><AlertCircle className="h-3 w-3 mr-1" />À renouveler</Badge>;
      default:
        return null;
    }
  };

  const handleGenerateQR = (nom: string) => {
    toast.success(`QR Code généré pour ${nom}`);
  };

  const handleBatchQR = () => {
    toast.success("QR Codes batch générés pour les patients sélectionnés");
  };

  const filteredPatients = userPatients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telephone.includes(searchTerm)
  );

  const stats = {
    actif: userPatients.filter(p => p.statut_csu === 'actif').length,
    en_attente: userPatients.filter(p => p.statut_csu === 'en_attente').length,
    a_renouveler: userPatients.filter(p => p.statut_csu === 'a_renouveler').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enrôlement CSU</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBatchQR}>
            <QrCode className="h-4 w-4 mr-2" />
            Générer QR Batch
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats CSU */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CSU Actifs</p>
                <p className="text-3xl font-bold text-[hsl(var(--status-vert))]">{stats.actif}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-[hsl(var(--status-vert))] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold text-[hsl(var(--status-orange))]">{stats.en_attente}</p>
              </div>
              <Clock className="h-12 w-12 text-[hsl(var(--status-orange))] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À renouveler</p>
                <p className="text-3xl font-bold text-[hsl(var(--status-rouge))]">{stats.a_renouveler}</p>
              </div>
              <AlertCircle className="h-12 w-12 text-[hsl(var(--status-rouge))] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fiches Patientes */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Fiches Patientes CSU</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredPatients.slice(0, 6).map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      </div>

      {/* Liste des patientes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Liste des patientes CSU</CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom ou téléphone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Date enrôlement</TableHead>
                <TableHead>Date renouvellement</TableHead>
                <TableHead>QR Code</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    {patient.prenom} {patient.nom}
                  </TableCell>
                  <TableCell className="text-sm">{patient.telephone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[150px]">
                    {patient.structure}
                  </TableCell>
                  <TableCell className="text-sm">{patient.agent}</TableCell>
                  <TableCell className="text-xs">{patient.date_enrolement}</TableCell>
                  <TableCell className="text-xs">{patient.date_renouvellement}</TableCell>
                  <TableCell>
                    {patient.qr_code ? (
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        <QrCode className="h-3 w-3 mr-1" />
                        {patient.qr_code}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(patient.statut_csu)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateQR(`${patient.prenom} ${patient.nom}`)}
                    >
                      <QrCode className="h-3 w-3 mr-1" />
                      QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
