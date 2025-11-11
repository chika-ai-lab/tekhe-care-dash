import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/data/mockData";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { countries, phoneNormalizer, isValidSenegalPhone } from "@/lib/phoneHelpers";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState("SN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [foundUser, setFoundUser] = useState<typeof mockUsers[0] | null>(null);

  const currentCountry = countries.find(c => c.code === selectedCountry);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Normaliser le numéro de téléphone
      const fullPhoneNumber = phoneNormalizer(phoneNumber, selectedCountry);
      
      // Valider le numéro
      if (!isValidSenegalPhone(fullPhoneNumber)) {
        toast.error("Numéro de téléphone invalide");
        return;
      }
      
      // Trouver l'utilisateur par numéro de téléphone
      const user = mockUsers.find(u => u.telephone === fullPhoneNumber);
      
      if (user) {
        setFoundUser(user);
        setStep('otp');
        toast.success(`Code OTP envoyé au ${fullPhoneNumber}`);
        toast.info("Code OTP de test : 123456");
      } else {
        toast.error("Numéro de téléphone non trouvé");
      }
    } catch (error) {
      toast.error("Erreur lors de la normalisation du numéro");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier le code OTP (simulé)
    if (otp === "123456") {
      if (foundUser) {
        login(foundUser);
        toast.success(`Bienvenue ${foundUser.prenom} ${foundUser.nom} !`);
        navigate("/dashboard");
      }
    } else {
      toast.error("Code OTP incorrect");
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtp("");
    setFoundUser(null);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      sage_femme: "Sage-femme",
      responsable_structure: "Responsable Structure",
      responsable_district: "Responsable District",
      partenaire_ong: "Partenaire ONG",
      partenaire_regional: "Partenaire Régional",
      partenaire_gouvernemental: "Partenaire Gouvernemental"
    };
    return labels[role] || role;
  };

  const formatPhoneForDisplay = (phone: string) => {
    // Afficher seulement la partie locale (sans +221)
    return phone.replace('+221', '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-tekhe p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--tekhe-red))] via-[hsl(var(--tekhe-orange))] to-[hsl(var(--tekhe-green))] bg-clip-text text-transparent">
            TEKHE
          </CardTitle>
          <CardDescription>
            Plateforme de suivi district/région
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Numéro de téléphone</label>
                <div className="flex gap-2">
                  {/* Country Selector */}
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue>
                        {currentCountry && (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{currentCountry.flag}</span>
                            <span className="text-sm">{currentCountry.dialCode}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground text-sm">({country.dialCode})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="70 123 45 67"
                      value={phoneNumber}
                      onChange={(e) => {
                        // Permettre seulement les chiffres et espaces
                        const value = e.target.value.replace(/[^\d\s]/g, '');
                        setPhoneNumber(value);
                      }}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Entrez votre numéro sans l'indicatif pays
                </p>
              </div>
              
              <Button type="submit" className="w-full">
                Envoyer le code OTP
              </Button>

              {/* Liste des numéros de test */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs font-semibold mb-2">Numéros de test :</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center">
                      <span>{user.prenom} {user.nom}</span>
                      <span className="font-mono">{formatPhoneForDisplay(user.telephone)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Code OTP de test : <span className="font-mono font-bold">123456</span>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              {foundUser && (
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm font-medium">
                    {foundUser.prenom} {foundUser.nom}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel(foundUser.role)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {foundUser.telephone}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Code OTP</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Entrez le code à 6 chiffres envoyé par SMS
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Retour
                </Button>
                <Button type="submit" className="flex-1" disabled={otp.length !== 6}>
                  Se connecter
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
