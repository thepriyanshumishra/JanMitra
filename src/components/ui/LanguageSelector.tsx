"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/lib/translations";

export function LanguageSelector() {
    const [open, setOpen] = React.useState(false);
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();

    const selectedLanguage = languages.find((l) => l.id === language);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-white/50 dark:bg-white/5 border-white/20 hover:bg-white/60 dark:hover:bg-white/10"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Globe className="w-4 h-4 text-slate-500" />
                        <span className="truncate notranslate">
                            {selectedLanguage ? `${selectedLanguage.native} (${selectedLanguage.name})` : "Select Language"}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-white/20">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {languages.map((lang) => (
                                <CommandItem
                                    key={lang.id}
                                    value={lang.name}
                                    onSelect={() => {
                                        setLanguage(lang.id);
                                        setOpen(false);

                                        if (pathname === "/") {
                                            // Google Translate Logic (Homepage Only)
                                            const targetLang = lang.id;
                                            document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
                                            document.cookie = `googtrans=/en/${targetLang}; path=/;`; // Fallback
                                            window.location.reload();
                                        } else {
                                            toast.info(`Language changed to ${lang.name} (Dummy on Dashboard)`);
                                        }
                                    }}
                                    className="cursor-pointer aria-selected:bg-blue-50 dark:aria-selected:bg-blue-900/20"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            language === lang.id ? "opacity-100 text-blue-600" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col notranslate">
                                        <span className="font-medium">{lang.native}</span>
                                        <span className="text-xs text-slate-500">{lang.name}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
