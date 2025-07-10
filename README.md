# Bokningssystem för Mötesrum

## Komma igång

Följ dessa steg för att installera och köra projektet lokalt.

### 1. Klona projektet

Klona detta repository till din lokala maskin.

```bash
git clone <URL_TILL_DITT_REPO>
cd <MAPPNAMN>
```

### 2. Skapa .env-fil

Skapa en fil i roten av projektet som heter `.env` och lägg till följande rad för att konfigurera databasen:

```
DATABASE_URL="file:./dev.db"
```

### 3. Installera Beroenden

Installera alla nödvändiga paket med npm.

```bash
npm install
```

### 4. Sätt upp Databasen

Detta kommando kommer att radera den befintliga databasen (om den finns), skapa en ny baserat på schemat, och köra seed-skriptet för att fylla den med testdata.

```bash
npx prisma migrate reset
```
*Notera: Svara `yes` på frågan i terminalen för att bekräfta återställningen.*


### 5. Starta Utvecklingsservern

Kör följande kommando för att starta applikationen.

```bash
npm run dev
```

Applikationen bör nu vara tillgänglig på [http://localhost:3000](http://localhost:3000).


---

## Mina antaganden

Under utvecklingen av detta projekt har jag gjort några antaganden för att fylla i detaljer som inte specificerades i uppgiftsbeskrivningen. Dessa val gjordes för att skapa en mer komplett och robust applikation.

#### Användargränssnitt & Flöde
1.  **Specifik Felhantering:** Vid nätverksfel (t.ex. när rum eller tider inte kan hämtas) visas ett tydligt felmeddelande och en "Försök igen"-knapp. Detta antogs vara en bättre användarupplevelse än att bara visa ett tomt eller trasigt gränssnitt.

#### Backend & Affärslogik
1.  **Öppettider:** Systemet antar att mötesrum är bokningsbara under standardkontorstid (08:00 till 17:00).
2.  **Bokningslängd:** Alla bokningar görs i fasta block om 60 minuter. Systemet hanterar inte bokningar med variabel längd än men det är enkelt att lägga till.
3.  **Användarinformation:** Endast ett fullständigt namn krävs för att göra en bokning. Ingen e-post, telefonnummer eller annan identifiering samlas in för att hålla bokningsprocessen så enkel som möjligt för denna uppgift.

#### Adminfunktionalitet & Dataintegritet
1.  **Oskyddad Adminpanel:** Adminpanelen på `/admin/rooms` för att hantera rum saknar avsiktligt autentisering. Detta är en medveten förenkling för att hålla projektet inom den rekommenderade tidsramen.
2.  **Soft Deletes:** När ett rum tas bort via adminpanelen raderas det inte permanent från databasen (s.k. "soft delete"). Detta gjordes för att bevara historiken för tidigare bokningar kopplade till rummet och för att tillåta att rum kan återställas.

---
Ett bokningssystem för mötesrum byggt med Next.js, TypeScript och SQLite.

## Arkitektur & Designmönster

### Backend-först-strategi

Jag valde att börja med backend-utveckling för att etablera en solid grund:

1.  **Database Schema Design** - Började med Prisma schema för att definiera datastrukturen
2.  **Repository Pattern** - Skapade repositories för dataåtkomst
3.  **Service Layer** - Implementerade affärslogik separat från dataåtkomst
4.  **API Endpoints** - Byggde RESTful API:er med proper error handling
5.  **Testing** - Testade endpoints i Postman innan frontend-utveckling

### Arkitektur Översikt

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── booking/           # Bokningssidor
│   ├── confirm/           # Bekräftelsesida
│   └── admin/             # Adminpanel
├── components/            # Återanvändbara komponenter
│   ├── ui/               # Grundläggande UI-komponenter
│   └── booking/          # Bokningsspecifika komponenter
├── lib/                   # Utilities och hjälpfunktioner
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript definitioner
│   └── utils/            # Hjälpfunktioner
└── server/               # Backend logik
    ├── repositories/     # Dataåtkomst
    ├── services/        # Affärslogik
    └── validations/     # Zod schemas
```

## Tekniska Val & Motivering

### Kärnteknologier

-   **Next.js 15** - App Router för modern utveckling med Server Components
-   **TypeScript** - Type safety genom hela applikationen
-   **TailwindCSS** - Utility-first CSS för snabb utveckling
-   **SQLite + Prisma** - Enkelt att sätta upp, lätt att migrera till PostgreSQL senare
-   **Zustand** - Lightweight state management

### Designmönster

**Motivering**: Repository-mönstret kapslar in alla Prisma-anrop så att domän- och dataåtkomstlager hålls åtskilda, vilket förenklar testning och underhåll.

#### 1. Repository Pattern

```typescript
export class BookingRepository {
  constructor(private prisma: PrismaClient) {}

  async findMany(filters: { date?: string; roomId?: number }) {
    // Dataåtkomst logik
  }
}
```

**Motivering**: Separerar dataåtkomst från affärslogik, gör det enkelt att byta databas eller cacha data.

#### 2. Service Layer Pattern

```typescript
export class BookingService {
  constructor(
    private bookingRepo: BookingRepository,
    private roomRepo: RoomRepository
  ) {}

  async createBooking(data: CreateBookingDto) {
    // Affärslogik och validering
  }
}
```

**Motivering**: Centraliserar affärsregler, gör det enkelt att testa och återanvända logik.

#### 3. Custom Error Classes

```typescript
export class BookingConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'BOOKING_CONFLICT');
  }
}
```

**Motivering**: Strukturerad felhantering som gör det enkelt att hantera olika feltyper i frontend.

#### 4. Transaction-Based Concurrency Control

```typescript
return this.prisma.$transaction(async (tx) => {
  const hasConflict = await this.bookingRepo.hasTimeConflict(/*...*/);
  if (hasConflict) {
    throw new BookingConflictError(/*...*/);
  }
  return await this.bookingRepo.create(data, tx);
});
```

## Teststrategi

### Backend-tester

1.  **Unit Tests** - Testar affärslogik i services
2.  **Integration Tests** - Testar API endpoints
3.  **Edge Case Tests** - Testar felhantering och gränsfall

### Manuell testprocess

1.  **Postman Testing** - Verifierade alla API endpoints
2.  **Frontend Integration** - Testade hela användarflödet

### Testtäckning

-   ✅ Booking service affärsregler
-   ✅ API endpoint validering
-   ✅ Error handling

## Funktionalitet

### Grundfunktioner

-   **Rumvisning** - Lista alla tillgängliga mötesrum
-   **Filtrering** - Lista ett rum
-   **Tidsnavigering** - Navigera mellan datum
-   **Bokning** - Komplett bokningsflöde
-   **Bekräftelse** - Visuell bekräftelse av bokning

### Avancerade Funktioner

-   **Virtualiserad Rendering** - Prestanda för många tidsluckor
-   **Real-time Validation** - Omedelbar feedback
-   **Adminpanel** - Hantering av rum (OBS) ingen auth medkommer
-   **Soft Delete** - Rum kan raderas utan att förlora data

## UX/UI-design

### Mobile-first-strategi

-   konsistent mobil upplevelse
-   Responsiv design för olika skärmstorlekar

### Tillgänglighet

-   Semantiska HTML-element
-   Proper ARIA-labels
-   Keyboard navigation support
-   Hög kontrast för text

## Skalbarhet & Förbättringar

### Enkla Tillägg (tack vare modulär arkitektur)

#### Authentication System

```typescript
// Enkelt att lägga till middleware
export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get('authorization');
  // Validera token och sätt user context
}

// Service layer redan förberedd
interface BookingContext {
  userId?: string;
  userRole?: 'admin' | 'user';
}
```

#### Email Notifications

```typescript
// Ny service för notifikationer
export class NotificationService {
  async sendBookingConfirmation(booking: Booking) {
    // Email/SMS logik
  }
}

// Integrera i booking service
await this.notificationService.sendBookingConfirmation(booking);
```

#### Kalenderintegration

```typescript
// CalendarService för olika leverantörer
export class CalendarService {
  async createCalendarEvent(booking: Booking) {
    // Google Calendar, Outlook integration
  }
}
```

### Prestandaoptimeringar

-   **Database Indexing** - Optimerade queries för stora datasets
-   **Caching Layer** - Redis för snabbare dataåtkomst
-   **CDN Integration** - Statiska assets
-   **Database Migration** - Från SQLite till PostgreSQL för produktion

## Databasschema

### Schemaöversikt

```sql
-- Rooms med soft delete support
CREATE TABLE "rooms" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT UNIQUE,
  "capacity" INTEGER,
  "deletedAt" DATETIME
);

-- Bokningar med unique constraint för konfliktprevention
CREATE TABLE "bookings" (
  "id" INTEGER PRIMARY KEY,
  "roomId" INTEGER,
  "date" DATETIME,
  "timeSlotId" INTEGER,
  -- Unique constraint förhindrar dubbelbokningar
  UNIQUE("roomId", "date", "timeSlotId")
);
```

### Migrationsstrategi

-   Prisma migrations för versionshantering
-   Seed data för utveckling och testing
-   Backup strategi för produktion

## Affärslogik – viktiga punkter

### Booking Conflict Prevention

-   Transaktionsbaserad approach
-   Proaktiv och reaktiv konflikthantering
-   Unique constraints i databas

### Datum- och tidshantering

-   Konsistent UTC hantering
-   Timezone-aware calculations
-   Business hours validation
-   Future booking limits

## API-design

### RESTful Endpoints

-   `GET /api/rooms` - Lista rum
-   `GET /api/timeslots` - Tillgängliga tider
-   `POST /api/bookings` - Skapa bokning
-   Konsistent error handling
-   Proper HTTP status codes

### Svarformat

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

## Framtida Utveckling

### Kort Sikt

-   User authentication
-   Email notifikationer
-   Förbättrad adminpanel
-   Mobile app (React Native)

## Slutsats

Detta projekt demonstrerar:

-   **Modern utvecklingsmetodik** med backend-first approach
-   **Skalbar arkitektur** som enkelt kan utökas
-   **Produktionsklar kod** med proper error handling och testing
-   **Användarcentrerat design** med fokus på UX
-   **Performance awareness** med optimerade rendering och queries

Den modulära strukturen gör det enkelt att lägga till nya funktioner utan att bryta befintlig kod, vilket är avgörande för långsiktig utveckling och underhåll.

