import { useState } from "react";

import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Checkbox } from "@/shared/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/RadioGroup";
import { Switch } from "@/shared/ui/Switch";
import { Badge } from "@/shared/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/Dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/Drawer";
import { Toaster } from "@/shared/ui/Toaster";
import { useToast } from "@/hooks/useToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/Accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/Table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/Pagination";

/**
 * Dev-only route (not in navRegistry, not linked from any real page) for
 * visually and functionally verifying all 17 primitives from
 * 04_Component_Library.md, in both themes, per F6's Definition of Done.
 * Not a real feature page — removed from the nav surface entirely,
 * reachable only by visiting /dev/playground directly.
 */
export function PlaygroundPage() {
  const [switchOn, setSwitchOn] = useState(false);
  const { toast } = useToast();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-8 text-foreground">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <header className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-semibold">Component Playground</h1>
            <ThemeToggle />
          </header>

          <Section title="Button">
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
          </Section>

          <Section title="Input & Textarea">
            <div className="grid max-w-sm gap-3">
              <Input placeholder="you@ryuzen.dev" />
              <Textarea placeholder="Write something…" />
            </div>
          </Section>

          <Section title="Select">
            <Select>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="org-admin">Organization Admin</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          <Section title="Checkbox, Radio Group & Switch">
            <div className="flex flex-wrap items-center gap-8">
              <label className="flex items-center gap-2 font-body text-sm">
                <Checkbox defaultChecked /> Remember me
              </label>
              <RadioGroup defaultValue="a" className="flex gap-4">
                <label className="flex items-center gap-2 font-body text-sm">
                  <RadioGroupItem value="a" /> Option A
                </label>
                <label className="flex items-center gap-2 font-body text-sm">
                  <RadioGroupItem value="b" /> Option B
                </label>
              </RadioGroup>
              <label className="flex items-center gap-2 font-body text-sm">
                <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                {switchOn ? "On" : "Off"}
              </label>
            </div>
          </Section>

          <Section title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          <Section title="Avatar & Tooltip">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/nonexistent.png" alt="User" />
                <AvatarFallback>RZ</AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>This is a tooltip</TooltipContent>
              </Tooltip>
            </div>
          </Section>

          <Section title="Dialog & Drawer">
            <div className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>This is a centered modal dialog.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Side panel</DrawerTitle>
                    <DrawerDescription>This is a sliding side-sheet drawer.</DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>

              <Button
                variant="outline"
                onClick={() => toast({ title: "Saved", description: "Your changes were saved." })}
              >
                Show Toast
              </Button>
            </div>
          </Section>

          <Section title="Tabs">
            <Tabs defaultValue="overview" className="max-w-md">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Overview panel content.</TabsContent>
              <TabsContent value="details">Details panel content.</TabsContent>
            </Tabs>
          </Section>

          <Section title="Accordion">
            <Accordion type="single" collapsible className="max-w-md">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is RyuZen?</AccordionTrigger>
                <AccordionContent>A campus engagement and career platform.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Who can use it?</AccordionTrigger>
                <AccordionContent>
                  Students, Faculty, Alumni, and Organization Admins.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Ava Sorenson</TableCell>
                  <TableCell>Student</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marcus Reyes</TableCell>
                  <TableCell>Faculty</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section title="Pagination">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Section>
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h2 className="font-display text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
