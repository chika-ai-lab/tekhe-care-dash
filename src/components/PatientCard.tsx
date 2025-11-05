import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient, mockRisquesIA } from "@/data/mockData";
import { Phone, Calendar, User, MapPin, AlertTriangle, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PatientCardProps {
  patient: Patient;
}

export const PatientCard = ({ patient }: PatientCardProps) => {
  const navigate = useNavigate();

  const patientRisk = mockRisquesIA.find(r => r.patient_id === patient.id);
  const isRedRisk = patientRisk?.niveau === 'rouge';

  const handleAlertSonu = () => {
    if (isRedRisk) {
      toast.success(`Alerte SONU envoyée pour ${patient.prenom} ${patient.nom}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/patient/${patient.id}`);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <Badge className="bg-[hsl(var(--status-vert))] text-white">Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-[hsl(var(--status-orange))] text-white">En attente</Badge>;
      case 'a_renouveler':
        return <Badge className="bg-[hsl(var(--status-rouge))] text-white">À renouveler</Badge>;
      default:
        return null;
    }
  };

  // Obtenir la classe de bordure selon le niveau de risque
  const getBorderColor = () => {
    if (!patientRisk) return 'border border-muted';

    switch (patientRisk.niveau) {
      case 'rouge':
        return 'border border-[hsl(var(--status-rouge))]';
      case 'orange':
        return 'border border-[hsl(var(--status-orange))]';
      case 'vert':
        return 'border border-[hsl(var(--status-vert))]';
      default:
        return 'border border-muted';
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${getBorderColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.prenom} {patient.nom}</h3>
              <p className="text-sm text-muted-foreground">{patient.age} ans</p>
            </div>
          </div>
          {getStatusBadge(patient.statut_csu)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{patient.telephone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{patient.semaines} SA</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">{patient.structure}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs">Agent: {patient.agent}</span>
          </div>
        </div>

        <div className="pt-2 border-t space-y-2">
          <Button 
            onClick={handleViewDetails}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir la fiche
          </Button>
          <Button 
            onClick={handleAlertSonu} 
            className="w-full bg-[hsl(var(--status-rouge))] hover:bg-[hsl(var(--status-rouge))]/90 text-white"
            size="sm"
            disabled={!isRedRisk}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerte SONU {!isRedRisk && '(Rouge uniquement)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
