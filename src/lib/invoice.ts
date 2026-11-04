"use client";

import jsPDF from "jspdf";
import type { Booking } from "./types";
import { formatDate, formatTime } from "./utils";

/** Generates and downloads a PDF receipt for a booking (Optional requirement) */
export function generateBookingInvoice(booking: Booking) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 64;

  const line = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(label, margin, y);

    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(20);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += 22;
  };

  const divider = () => {
    y += 6;
    doc.setDrawColor(225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 24;
  };

  /* ---------------------------- Header ---------------------------- */
  doc.setFillColor(245, 166, 35);
  doc.circle(margin + 14, y - 6, 14, "F");
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("StudioSpace", margin + 38, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text("Peer-to-peer creative workspace sharing", margin + 38, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20);
  doc.text("BOOKING INVOICE", pageWidth - margin, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`#${booking._id.slice(-8).toUpperCase()}`, pageWidth - margin, y + 15, {
    align: "right",
  });

  y += 52;

  doc.setFillColor(248, 248, 250);
  doc.roundedRect(margin, y - 18, pageWidth - margin * 2, 34, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(`Status: ${booking.status.toUpperCase()}`, margin + 12, y + 4);

  y += 46;

  /* ---------------------------- Details --------------------------- */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Studio", margin, y);
  y += 20;

  line("Studio name", booking.studioTitle);
  line("Location", booking.location);
  line("Hourly rate", `$${booking.hourlyRate}`);

  divider();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Reservation", margin, y);
  y += 20;

  line("Date", formatDate(booking.date));
  line("Time slot", `${formatTime(booking.startTime)}  –  ${formatTime(booking.endTime)}`);
  line("Duration", `${booking.hours} hour${booking.hours === 1 ? "" : "s"}`);

  divider();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Guest", margin, y);
  y += 20;

  line("Name", booking.userName);
  line("Email", booking.userEmail);

  divider();

  /* ----------------------------- Total ---------------------------- */
  doc.setFillColor(245, 166, 35);
  doc.roundedRect(margin, y - 20, pageWidth - margin * 2, 46, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(30);
  doc.text("Total due", margin + 14, y + 6);
  doc.setFontSize(18);
  doc.text(
    `$${booking.totalCost.toLocaleString()}`,
    pageWidth - margin - 14,
    y + 8,
    { align: "right" }
  );

  y += 66;

  if (booking.note) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20);
    doc.text("Notes", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90);
    doc.text(doc.splitTextToSize(booking.note, pageWidth - margin * 2), margin, y);
  }

  /* ---------------------------- Footer ---------------------------- */
  const footerY = doc.internal.pageSize.getHeight() - 56;
  doc.setDrawColor(225);
  doc.line(margin, footerY - 16, pageWidth - margin, footerY - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(
    "Thank you for booking with StudioSpace. This receipt is generated automatically.",
    margin,
    footerY
  );
  doc.text(
    `Issued ${new Date().toLocaleString("en-GB")}`,
    pageWidth - margin,
    footerY,
    { align: "right" }
  );

  doc.save(`StudioSpace-Invoice-${booking._id.slice(-8).toUpperCase()}.pdf`);
}
