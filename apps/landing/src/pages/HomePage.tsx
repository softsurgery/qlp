import { DataTableBuilder } from "@qlp/datatable-builder";
import {
  FormBuilder,
  type FormSchema,
  type FormValues,
} from "@qlp/form-builder";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qlp/ui";
import { toast } from "sonner";

const contactSchema: FormSchema = {
  title: "Talk to us",
  description: "Tell us what you are building and we will get back to you.",
  submitLabel: "Send message",
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Ada Lovelace",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "ada@example.com",
      required: true,
    },
    {
      name: "interest",
      label: "Interest",
      type: "select",
      required: true,
      options: [
        { label: "Forms", value: "forms" },
        { label: "Data tables", value: "tables" },
        { label: "Both", value: "both" },
      ],
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "What would you like to build?",
      required: true,
    },
    {
      name: "updates",
      label: "Send me product updates",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

const features = [
  { name: "Form Builder", kind: "Package", status: "Ready" },
  { name: "Data Table Builder", kind: "Package", status: "Ready" },
  { name: "Landing", kind: "App", status: "Ready" },
];

export default function HomePage() {
  const handleSubmit = (values: FormValues) => {
    toast.success(
      `Thanks ${String(values.name || "there")}, we received your message.`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="text-sm font-semibold tracking-wide">QLP</p>
          <Button asChild variant="outline" size="sm">
            <a href="#builders">See builders</a>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-16 px-6 py-16">
        <section className="grid max-w-2xl gap-4">
          <Badge className="w-fit">New workspace</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">
            Build forms and tables from a schema.
          </h1>
          <p className="text-lg text-muted-foreground">
            Landing is the public app. Form Builder and Data Table Builder are
            shared packages you can use across the workspace.
          </p>
        </section>

        <section id="builders" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>
                Render a complete form from a typed schema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormBuilder schema={contactSchema} onSubmit={handleSubmit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Table Builder</CardTitle>
              <CardDescription>
                Search, sort, and paginate rows from column definitions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTableBuilder
                data={features}
                searchPlaceholder="Search workspace items"
                columns={[
                  {
                    id: "name",
                    header: "Name",
                    accessor: "name",
                    sortable: true,
                  },
                  {
                    id: "kind",
                    header: "Kind",
                    accessor: "kind",
                    sortable: true,
                  },
                  { id: "status", header: "Status", accessor: "status" },
                ]}
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
