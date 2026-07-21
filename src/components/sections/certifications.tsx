"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import type { Certification } from "@/lib/content-types";

function isCertEnabled(cert: Certification) {
  return cert.enabled !== false;
}

export function filterHeroCertifications(certifications: Certification[]) {
  return certifications.filter(
    (cert) => isCertEnabled(cert) && cert.showInHero,
  );
}

export function filterFooterCertifications(certifications: Certification[]) {
  return certifications.filter(
    (cert) => isCertEnabled(cert) && cert.showInFooter,
  );
}

export function CertificationMark({
  certification,
  size = "md",
}: {
  certification: Certification;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const awardSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textClass =
    size === "sm"
      ? "text-sm text-on-dark-secondary"
      : "text-sm font-semibold text-on-dark-secondary";

  return (
    <div className="flex items-center gap-2.5">
      {certification.imageUrl ? (
        <Image
          src={certification.imageUrl}
          alt={certification.label}
          width={size === "sm" ? 32 : 40}
          height={size === "sm" ? 32 : 40}
          className={`${iconSize} rounded-full object-cover ring-1 ring-brand-electric/30`}
        />
      ) : (
        <span
          className={`flex ${iconSize} shrink-0 items-center justify-center rounded-full bg-brand-navy/80 ring-1 ring-brand-electric/30`}
        >
          <Award className={`${awardSize} text-brand-electric`} aria-hidden />
        </span>
      )}
      <span className={textClass}>{certification.label}</span>
    </div>
  );
}

export function HeroCertifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  const visible = filterHeroCertifications(certifications);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((cert) => (
        <CertificationMark key={cert._id} certification={cert} size="md" />
      ))}
    </>
  );
}

export function FooterCertifications({
  certifications,
}: {
  certifications: Certification[];
}) {
  const visible = filterFooterCertifications(certifications);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map((cert) => (
        <CertificationMark key={cert._id} certification={cert} size="sm" />
      ))}
    </div>
  );
}
