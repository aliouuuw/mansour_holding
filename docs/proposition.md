# Plateforme Digitale Unifiée
## Mansour Holding

---

## Vision Stratégique

Mansour Holding réunit un portefeuille d'entreprises d'exception au Sénégal — automobile, immobilier, construction, location, parfumerie et coiffure. L'objectif de cette plateforme est de consolider l'ensemble de ces activités sous un écosystème digital unifié, offrant une expérience de prestige cohérente et des outils de gestion performants.

**Résultat attendu** : Plateforme multi-tenant avec identité unique, système d'authentification centralisé, dashboards métier spécialisés, et synergies cross-business pour maximiser la performance du groupe.

---

## Services Proposés

### 1. Architecture Unifiée Multi-Tenant

#### 1.1 Site Vitrine Holding
Présence digitale de prestige présentant le groupe et l'ensemble du portefeuille.

**Fonctionnalités** :
- **Page d'accueil institutionnelle** : Présentation du groupe, vision, valeurs, identité visuelle noir-or-argent
- **Portfolio des entreprises** : Grille asymétrique présentant les 6 activités (Motors, Immobilier, Location, Construction, Parfums, Grooming)
- **Statistiques du groupe** : KPI consolidés, années d'expérience, clients satisfaits
- **Section À propos** : Histoire, leadership, ancrage sénégalais, ambition panafricaine
- **Contact centralisé** : Formulaire de contact avec routage automatique vers l'entreprise concernée
- **Design system luxury** : Palette Mansour Noir (noir-950, gold-400, silver-300), typographie Plus Jakarta Sans

#### 1.2 Plateforme Applicative Unifiée
Tableau de bord multi-business avec authentification centralisée.

**Architecture technique** :
- **Single Sign-On (SSO)** : Un seul compte pour accéder à tous les dashboards autorisés
- **RBAC (Role-Based Access Control)** : Permissions granulaires par entreprise et par rôle
- **Modules métier** : Dashboard spécialisé pour chaque activité (Motors, Immobilier, etc.)
- **Sidebar unifiée** : Navigation cohérente avec switch rapide entre entreprises
- **Stack moderne** : React 19, Hono, Drizzle ORM, PostgreSQL, Redis, BullMQ
- **Hébergement VPS Hetzner** : Infrastructure auto-gérée avec Docker, Caddy, PM2
- **Performance** : < 2 secondes de chargement, responsive mobile-first

**Résultat attendu** : Écosystème digital unifié, expérience utilisateur cohérente, réduction des coûts d'infrastructure, synergies cross-business.

---

### 2. Modules Métier par Entreprise

#### 2.1 Mansour Motors (Phase 1 — Q1 2026)
Gestion complète du concessionnaire automobile.

**Fonctionnalités** :
- **Gestion d'inventaire** : Catalogue véhicules avec photos, specs, prix, disponibilité
- **Pipeline de vente** : Lead tracking, essais routiers, négociation, closing
- **CRM clients** : Profils acheteurs, historique d'achat, communications
- **Intégration financement** : Calculateur de prêt, suivi des paiements, documents
- **Dashboard commercial** : Métriques de performance, commissions, activité
- **Site public** : Recherche véhicules, pages détaillées, formulaires de contact

#### 2.2 Mansour Immobilier (Phase 2 — Q2 2026)
Gestion immobilière résidentielle et commerciale.

**Fonctionnalités** :
- **Listings propriétés** : Résidentiel et commercial avec galeries médias
- **Gestion clients** : Acheteurs, vendeurs, locataires avec historique
- **Planification visites** : Système de rendez-vous pour tours de propriétés
- **Pipeline transactions** : Gestion d'offres, contrats, jalons de closing
- **Hub documentaire** : Contrats, divulgations, rapports d'inspection
- **Site public** : Recherche avec carte, pages propriétés, profils agents

#### 2.3 Mansour Location (Phase 3 — Q3 2026)
Location de véhicules avec gestion de flotte.

**Fonctionnalités** :
- **Gestion de flotte** : Disponibilité, maintenance, kilométrage
- **Système de réservation** : Booking en ligne, calendrier, gestion des tarifs
- **Portail client** : Historique, programme fidélité, vérification permis
- **Opérations** : Check-in/out, rapport de dommages, suivi carburant
- **Facturation** : Tarification dynamique, options (assurance, GPS), factures

#### 2.4 Mansour Construction (Phase 4 — Q4 2026)
Gestion de projets de construction.

**Fonctionnalités** :
- **Gestion de projets** : Timeline, jalons, suivi budgétaire
- **Hub contractants** : Profils sous-traitants, contrats, paiements
- **Portail client** : Photos de progression, documents, historique paiements
- **Gestion ressources** : Inventaire équipement, approvisionnement matériaux
- **Sécurité & conformité** : Checklists inspection, permis, incidents

#### 2.5 Cluster Retail (Phase 5 — Q1 2027)
POS et gestion pour Parfums, Grooming, Shopping.

**Mansour Parfums** :
- Catalogue fragrances, gestion stock, POS, programme fidélité

**Mansour Grooming** :
- Système de rendez-vous, menu services, gestion stylistes, planning

**Mansour Shopping** :
- E-commerce, gestion inventaire multi-canal, fulfillment, tracking

**Résultat attendu** : Chaque entreprise dispose d'outils métier adaptés, données centralisées, workflows optimisés.

---

### 3. Synergies Cross-Business

#### 3.1 Base de Données Client Unifiée
Capitalisation sur les interactions multi-entreprises.

**Fonctionnalités** :
- **Profil client unique** : Un client de Motors devient automatiquement prospect pour Immobilier
- **Historique consolidé** : Vue 360° des interactions avec toutes les entreprises du groupe
- **Segmentation intelligente** : Identification des opportunités de cross-selling
- **Programme fidélité unifié** : Points gagnés dans une entreprise, utilisables dans toutes
- **Recommandations internes** : Staff peut créer des leads cross-business avec tracking

#### 3.2 Analytics Consolidées
Vision globale de la performance du groupe.

**Tableaux de bord** :
- **Dashboard Holding** : P&L consolidé, performance par entreprise, KPI groupe
- **Métriques cross-business** : Taux de conversion cross-sell, valeur vie client groupe
- **Rapports automatisés** : Exports mensuels, analyses de tendances, prévisions
- **Alertes intelligentes** : Notifications sur opportunités, anomalies, jalons atteints

#### 3.3 Intégrations Externes
Connexions avec services tiers pour automatisation.

**Intégrations** :
- **Paiements** : Stripe pour transactions en ligne, Wave/Orange Money pour mobile money
- **Communications** : Resend pour emails transactionnels, Twilio pour SMS
- **Stockage** : S3-compatible (MinIO auto-hébergé ou Cloudflare R2) pour médias
- **Monitoring** : Sentry pour tracking d'erreurs, Axiom pour logs centralisés
- **Maps** : Google Maps pour localisation (propriétés, showrooms, chantiers)

**Résultat attendu** : Synergies maximisées, données exploitées, croissance organique cross-business, réduction des coûts d'acquisition.

---

### 4. Design System & Identité Visuelle

#### 4.1 Palette Mansour Noir
Identité visuelle luxury cohérente sur toute la plateforme.

**Couleurs** :
- **Noir** : `noir-950` (#0A0A0A) pour sidebar, hero backgrounds, surfaces premium
- **Or** : `gold-400` (#C8A84E) comme accent signature — CTAs, états actifs, liens
- **Argent** : `silver-300` (#ACACAC) pour accents secondaires, icônes, texte muted
- **Sémantiques** : Jade (succès), Amber (warning), Garnet (danger), Steel (info) — tous désaturés pour maintenir le luxe

#### 4.2 Typographie & Hiérarchie
Plus Jakarta Sans pour autorité et lisibilité.

**Échelle** :
- **Display XL** : 56-64px, ExtraBold, -0.03em — Hero landing
- **H1** : 28-30px, Bold, -0.015em — Titres de page
- **Body** : 14px, Regular, 1.6 line-height — Texte UI par défaut
- **Overline** : 11px, SemiBold, 0.08em uppercase — Labels de section
- **Prices/KPI** : Toujours bold, `tabular-nums`, alignés à droite

#### 4.3 Composants UI
Bibliothèque cohérente pour toutes les entreprises.

**Composants** :
- **Sidebar** : Noir pur avec navigation or, switch entreprise en header
- **Cards** : Surface blanche, border subtile, hover gold, radius 6-8px (sharp, pas bubbly)
- **Buttons** : Gold primary, noir secondary, ghost tertiary — pas de gradients
- **Tables** : TanStack Table, headers silver-100, rows hover gold-50
- **Forms** : React Hook Form + Zod, validation inline, états d'erreur garnet
- **Modals** : Surface blanche, overlay noir-950/80, animations subtiles
- **Icons** : Lucide React, stroke 1.5, pas de backgrounds colorés

#### 4.4 Voix de Marque
Ton autoritaire, précis, exclusif.

**Conventions** :
- **Langue** : Français formel (jamais casual), English pour tech
- **Devise** : XOF (Franc CFA), pas de décimales, toujours formaté
- **Dates** : `dd MMM yyyy` (ex: "15 janv. 2026")
- **Téléphone** : +221 XX XXX XX XX
- **Pas d'emoji** : Jamais dans l'UI — unprofessional pour ce tier
- **Microcopy** : Direct, confiant — "Opération effectuée" pas "Super! Ça a marché 🎉"

**Résultat attendu** : Identité visuelle distinctive, expérience premium cohérente, différenciation claire vs SaaS générique.

---

## Tarification

### Approche par Phases

La plateforme Mansour Holding est conçue pour une implémentation progressive, permettant de valider chaque module avant d'étendre au suivant.

---

### Phase 1 : Fondations + Mansour Motors — 18 500 000 F CFA
**Livraison : Q1 2026 (12 semaines)**

**Infrastructure de base** :
- Site vitrine Holding (landing page institutionnelle)
- Architecture multi-tenant (base de données, auth, RBAC)
- Design system complet (composants UI, tokens, documentation)
- Hébergement VPS Hetzner avec Docker + Caddy
- Configuration CI/CD (tests, déploiement automatisé)

**Module Mansour Motors** :
- Dashboard complet (inventaire, pipeline, CRM, financement)
- Site public avec recherche avancée et pages véhicules
- Intégrations (WhatsApp, email, paiements)
- Formation équipe (4 sessions)
- Documentation technique

**Support** : 3 mois inclus (réponse < 24h)

---

### Phase 2 : Mansour Immobilier — 12 800 000 F CFA
**Livraison : Q2 2026 (8 semaines)**

**Module Immobilier** :
- Dashboard gestion propriétés (listings, clients, visites)
- Site public avec recherche cartographique
- Pipeline transactions et hub documentaire
- Intégration Google Maps
- Formation équipe (3 sessions)

**Synergies** :
- Base client unifiée avec Motors
- Analytics consolidées (2 entreprises)
- Cross-selling automatisé

**Support** : 2 mois inclus

---

### Phase 3 : Mansour Location — 10 500 000 F CFA
**Livraison : Q3 2026 (6 semaines)**

**Module Location** :
- Dashboard gestion flotte (disponibilité, maintenance)
- Système de réservation en ligne
- Portail client avec programme fidélité
- Facturation dynamique
- Formation équipe (2 sessions)

**Synergies** :
- Partage base véhicules avec Motors
- Programme fidélité unifié (3 entreprises)

**Support** : 2 mois inclus

---

### Phase 4 : Mansour Construction — 14 200 000 F CFA
**Livraison : Q4 2026 (10 semaines)**

**Module Construction** :
- Dashboard gestion projets (timeline, budget, jalons)
- Hub contractants et sous-traitants
- Portail client avec photos progression
- Gestion ressources et conformité
- Formation équipe (3 sessions)

**Support** : 2 mois inclus

---

### Phase 5 : Cluster Retail (Parfums + Grooming + Shopping) — 16 800 000 F CFA
**Livraison : Q1 2027 (12 semaines)**

**Trois modules retail** :
- **Mansour Parfums** : Catalogue, POS, gestion stock, fidélité
- **Mansour Grooming** : Système rendez-vous, gestion stylistes, planning
- **Mansour Shopping** : E-commerce complet, inventaire multi-canal, fulfillment

**Synergies** :
- POS unifié pour les 3 activités
- Programme fidélité groupe (6 entreprises)
- Analytics consolidées complètes

**Support** : 3 mois inclus

---

### Tarification Globale

| Phase | Entreprises | Tarif | Délai | Cumul |
|-------|-------------|-------|-------|-------|
| **Phase 1** | Holding + Motors | 18 500 000 F | 12 sem | 18 500 000 F |
| **Phase 2** | + Immobilier | 12 800 000 F | 8 sem | 31 300 000 F |
| **Phase 3** | + Location | 10 500 000 F | 6 sem | 41 800 000 F |
| **Phase 4** | + Construction | 14 200 000 F | 10 sem | 56 000 000 F |
| **Phase 5** | + Retail (×3) | 16 800 000 F | 12 sem | **72 800 000 F** |

**Durée totale** : 48 semaines (12 mois)

---

### Options Additionnelles

| Service | Tarif |
|---------|-------|
| Application mobile native (iOS + Android) | 22 000 000 F CFA |
| Chatbot IA multi-entreprises | 4 500 000 F CFA |
| Module BI avancé (Power BI / Tableau) | 6 800 000 F CFA |
| API publique pour intégrations tierces | 3 200 000 F CFA |
| Formation développeur interne (transfer de connaissances) | 2 500 000 F CFA |
| Audit de sécurité complet (pentest) | 1 800 000 F CFA |
| Maintenance étendue annuelle (post-garantie) | 3 600 000 F CFA/an |

---

## Modalités de Paiement

### Structure par Phase
Chaque phase est contractualisée et facturée indépendamment.

**Calendrier de paiement** :
- **Acompte** : 40% à la signature du contrat de phase
- **Paiement intermédiaire** : 30% à la validation des maquettes et architecture
- **Solde** : 30% à la livraison et validation finale de la phase

**Modes de paiement** :
- Virement bancaire (préféré pour montants importants)
- Wave / Orange Money (jusqu'à 5 000 000 F CFA par transaction)
- Chèque certifié

### Remises pour Engagement Global

| Engagement | Remise | Économie |
|------------|--------|----------|
| Phases 1-2 (signature simultanée) | 5% | 1 565 000 F |
| Phases 1-3 (signature simultanée) | 8% | 3 344 000 F |
| Phases 1-5 (engagement complet) | 12% | **8 736 000 F** |

**Tarif avec engagement complet** : 64 064 000 F CFA (au lieu de 72 800 000 F)

---

## Garanties et Engagement

### Garanties Techniques
- **Propriété intellectuelle** : Code source propriété exclusive de Mansour Holding
- **Performance** : Temps de chargement < 2 secondes garanti
- **Disponibilité** : SLA 99.5% (uptime monitoring avec alertes)
- **Sécurité** : SSL, chiffrement des données sensibles, conformité RGPD
- **Scalabilité** : Architecture conçue pour supporter 10 000+ utilisateurs

### Support et Maintenance
- **Support inclus** : Durée variable selon phase (2-3 mois post-livraison)
- **Corrections de bugs** : Illimitées pendant période de garantie
- **Mises à jour de sécurité** : Appliquées automatiquement
- **Monitoring 24/7** : Sentry (erreurs) + Axiom (logs) + alertes
- **Backups quotidiens** : Rétention 30 jours, restauration < 4h

### Formation et Documentation
- **Formation équipe** : Sessions adaptées par rôle (admin, commercial, manager)
- **Documentation technique** : Architecture, API, guides de déploiement
- **Documentation utilisateur** : Guides par module, vidéos tutoriels
- **Knowledge base** : Base de connaissances interne pour support autonome

### Révisions et Ajustements
- **Phase de développement** : Révisions illimitées sur maquettes et workflows
- **Post-livraison** : 2 cycles de révisions mineures inclus par phase
- **Évolutions majeures** : Devis séparé après analyse du besoin

---

## Calendrier de Mise en Œuvre

### Phase 1 : Fondations + Motors (12 semaines)

**Semaines 1-2** : Cadrage et architecture
- Réunion de lancement (stakeholders, objectifs, contraintes)
- Finalisation schéma base de données multi-tenant
- Wireframes dashboard Motors + landing Holding
- Validation design system et maquettes

**Semaines 3-6** : Développement infrastructure
- Configuration VPS, Docker, CI/CD
- Authentification centralisée (better-auth)
- Design system (composants React, tokens Tailwind)
- API de base (Hono + Drizzle)

**Semaines 7-10** : Développement Motors
- Module inventaire et pipeline de vente
- CRM et intégrations (WhatsApp, email)
- Site public avec recherche et pages véhicules
- Tests unitaires et E2E (Vitest, Playwright)

**Semaines 11-12** : Tests, formation, déploiement
- Tests d'acceptation utilisateur (UAT)
- Formation équipe Motors (4 sessions)
- Migration données initiales
- Déploiement production + monitoring

---

## Prochaines Étapes

### Étape 1 : Validation Stratégique
- Présentation de la proposition au comité de direction
- Validation de l'approche par phases
- Décision sur engagement (phase unique ou global)

### Étape 2 : Réunion de Cadrage
- Audit de l'existant (données, processus, outils actuels)
- Définition des priorités fonctionnelles
- Identification des stakeholders par entreprise
- Validation du planning détaillé

### Étape 3 : Contractualisation
- Signature du contrat Phase 1 (ou engagement global)
- Définition des jalons de validation
- Mise en place de la gouvernance projet

### Étape 4 : Lancement
- Versement de l'acompte (40%)
- Kick-off meeting avec équipes techniques
- Accès aux environnements de développement
- Démarrage du sprint 1

---

## Contact

Pour toute question, demande de clarification ou personnalisation de cette proposition :

**Aliou Wade**  
Architecte de Solutions Digitales  
Email : [votre-email]  
Téléphone : [votre-numéro]  
WhatsApp : [votre-whatsapp]

**Disponibilité** :
- Réunion de présentation détaillée (visio ou présentiel)
- Démonstration de plateformes similaires
- Visite de nos références clients
- Atelier de co-création pour affiner les besoins

---

## Annexes

### A. Stack Technique Détaillée
- **Frontend** : React 19, Vite, TanStack Router/Query, XState 5, TailwindCSS 4
- **Backend** : Hono, Drizzle ORM, PostgreSQL, Redis, BullMQ
- **Auth** : better-auth (JWT, sessions, RBAC)
- **Monitoring** : Sentry (errors), Axiom (logs)
- **Paiements** : Stripe, Wave, Orange Money
- **Email** : Resend + React Email
- **Storage** : MinIO (S3-compatible)
- **Déploiement** : Docker Compose, Caddy (reverse proxy), PM2

### B. Références
- Portfolio de projets similaires disponible sur demande
- Témoignages clients
- Études de cas (automotive, real estate, construction)

### C. Équipe
- **Architecte Lead** : 8+ ans d'expérience plateformes multi-tenant
- **Développeurs Full-Stack** : Équipe de 3 développeurs seniors
- **Designer UI/UX** : Spécialiste luxury brands
- **DevOps** : Expert infrastructure auto-hébergée

---

*Proposition valable 60 jours à compter de la date d'émission.*  
*Document confidentiel — Usage exclusif Mansour Holding.*