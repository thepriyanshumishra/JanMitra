"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    data: any[];
    filename?: string;
}

export function ExportButton({ data, filename = "export.csv" }: ExportButtonProps) {
    function handleExport() {
        if (!data || data.length === 0) return;

        // Get headers
        const headers = Object.keys(data[0]);

        // Convert to CSV
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                // Handle strings with commas or newlines
                if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleExport} disabled={!data || data.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
        </Button>
    );
}
