import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { DottedSeparator } from "./DottedSeparator";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { useParams } from "next/navigation";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

export const ProjectList = ({ data, total }) => {
  const { workspaceId } = useParams();
  const { open } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="secondary" size="icon" onClick={open}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {total > 0 ? (
            data.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/workspaces/${workspaceId}/projects/${project.id}`}
                >
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4 flex items-center gap-x-2.5">
                      <ProjectAvatar
                        name={project.name}
                        image={project.imageUrl}
                        className="size-12"
                        fallbackClassName="text-lg"
                      />
                      <p className="text-lg font-medium truncate">
                        {project.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground hidden first-of-type:block">
              No projects found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
