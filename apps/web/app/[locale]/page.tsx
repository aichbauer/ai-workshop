import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRuntimeHealth } from "../../lib/fetchRuntimeHealth";
import { isLocale, type Locale } from "../../lib/routing";
import messagesDe from "../../messages/de.json";
import messagesEn from "../../messages/en.json";

type LocalizedHomePageProps = {
  params: Promise<{ locale: string }>;
};

const messages = {
  en: messagesEn,
  de: messagesDe,
} as const;

function getMessages(locale: Locale) {
  return messages[locale];
}

function getStatusClasses(status: string) {
  if (status === "healthy") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "degraded") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-rose-100 text-rose-800";
}

export async function generateMetadata({
  params,
}: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = isLocale(locale) ? locale : "en";
  const dictionary = getMessages(resolvedLocale);

  return {
    title: dictionary["health.meta.title"],
    description: dictionary["health.meta.description"],
    alternates: {
      canonical: `/${resolvedLocale}`,
      languages: {
        en: "/en",
        de: "/de",
        "x-default": "/",
      },
    },
  };
}

export default async function LocalizedHomePage({ params }: LocalizedHomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getMessages(locale);
  const report = await fetchRuntimeHealth();
  const checkedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(report.checkedAt));

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-10 text-stone-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-400">AI Workshop Starter Kit</p>
            <h1 className="mt-3 text-4xl font-semibold">{dictionary["health.title"]}</h1>
            <p className="mt-3 max-w-2xl text-base text-stone-300">
              {dictionary["health.description"]}
            </p>
          </div>
          <nav className="flex gap-3 text-sm">
            <a
              className="rounded-full border border-stone-700 px-4 py-2 hover:border-stone-500"
              href="/en"
            >
              {dictionary["common.language.en"]}
            </a>
            <a
              className="rounded-full border border-stone-700 px-4 py-2 hover:border-stone-500"
              href="/de"
            >
              {dictionary["common.language.de"]}
            </a>
          </nav>
        </header>

        <section className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 shadow-2xl shadow-stone-950/30">
          <p className="text-sm text-stone-400">
            {dictionary["health.lastChecked"]} {checkedAt}
          </p>

          <div className="mt-6 grid gap-4">
            {report.services.map((service) => (
              <article
                key={service.key}
                className="rounded-2xl border border-stone-800 bg-stone-950 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-medium">
                    {dictionary[`health.service.${service.key}`]}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(service.status)}`}
                  >
                    {dictionary[`health.status.${service.status}`]}
                  </span>
                </div>

                <dl className="mt-5 grid gap-3 text-sm text-stone-300">
                  <div>
                    <dt className="text-stone-500">{dictionary["health.endpoint"]}</dt>
                    <dd className="mt-1 break-all font-mono text-stone-200">{service.endpoint}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">{dictionary["health.probe"]}</dt>
                    <dd className="mt-1">{dictionary[`health.probe.${service.probe}`]}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">{dictionary["health.latency"]}</dt>
                    <dd className="mt-1">
                      {service.latencyMs === null
                        ? dictionary["health.latencyUnavailable"]
                        : dictionary["health.latencyValue"].replace(
                            "{value}",
                            String(service.latencyMs)
                          )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">{dictionary["health.details"]}</dt>
                    <dd className="mt-1">{service.detail}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
