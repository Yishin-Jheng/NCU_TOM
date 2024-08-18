"use client";
import { createTarget } from "@/apis/targets/createTarget";
import { TagOptions } from "@/components/TagOptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import FileUpload from "./fileUpload";

function isHourAngleFormat(input: string) {
  const hourMinSecPattern = /^(\d{1,2}h)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decMinSecPattern = /^(\+|-)?(\d{1,3}d)?(\d{1,2}m)?(\d{1,2}(\.\d+)?s)?$/;
  const decimalPattern =
    /^(\+|-)?(\d{1,2})\s+(\d{1,2})\s+(\d{1,2}(\.\d+)?)\s*$/;

  return (
    hourMinSecPattern.test(input) ||
    decMinSecPattern.test(input) ||
    decimalPattern.test(input)
  );
}

function convertHourAngleToDegrees(hourAngle: unknown) {
  console.log(hourAngle);
  if (typeof hourAngle !== "string") {
    return Error("Invalid hour angle format");
  }
  if (!isHourAngleFormat(hourAngle)) {
    return parseFloat(hourAngle);
  }

  const parts = hourAngle.split(/:|h|m|s|\s/).slice(0, 3); // Match colon, h, m, s, or whitespace
  if (parts.length !== 3) {
    return Error("Invalid hour angle format");
  }

  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);
  console.log(hours, minutes, seconds);

  const degrees = (hours + minutes / 60 + seconds / 3600) * 15;
  return degrees;
}

function convertSexagesimalDegreesToDecimal(sexagesimal: unknown) {
  if (typeof sexagesimal !== "string") {
    return Error("Invalid sexagesimal format");
  }
  if (!isHourAngleFormat(sexagesimal)) {
    return parseFloat(sexagesimal);
  }

  const parts = sexagesimal
    .slice(0, -1)
    .split(/:|d|m|s|\s/)
    .slice(0, 3);
  if (parts.length !== 3) {
    return Error("Invalid sexagesimal format");
  }

  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);
  const decimalDegrees = degrees + minutes / 60 + seconds / 3600;
  console.log(degrees, minutes, seconds);
  return decimalDegrees;
}

export function NewTargetFrom({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedTags, setSelectedTags] = useState<
    z.infer<typeof formSchema>["tags"]
  >([]);

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return createTarget(values);
    },
    onSuccess: () => {
      refetch();
      toast.success("Target created successfully");
      setOpen(false);
    },
  });

  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }),
    ra: z.preprocess(
      convertHourAngleToDegrees,
      z
        .number({
          required_error: "RA is required",
          invalid_type_error: "Not recognized coordinates",
        })
        .min(0)
        .max(360)
    ),
    dec: z.preprocess(
      convertSexagesimalDegreesToDecimal,
      z
        .number({
          required_error: "DEC is required",
          invalid_type_error: "Not recognized coordinates",
        })
        .min(-90)
        .max(90)
    ),
    tags: z.array(
      z.object({
        name: z.string(),
        targets: z.array(z.number()),
        observations: z.array(z.number()),
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tags: selectedTags,
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogTrigger asChild>
        <Button size={"lg"} variant="outline">
          Create target
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[720px]">
        <DialogHeader>
          <DialogTitle>New Target info</DialogTitle>
          <DialogDescription>
            Enter the {`target's`} info to create a new target. We also support
            csv file for bulk upload.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              mutation.mutate(values);
            })}
            className="space-y-8 items-center justify-center align-center"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-primary-foreground"
                      placeholder="Target name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ra"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="text-primary-foreground flex items-center gap-2">
                            RA{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="size-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </svg>
                          </FormLabel>
                        </TooltipTrigger>

                        <TooltipContent>
                          Support formats: degrees <br />
                          12h34m56.78s <br />
                          12 30 49.42338414
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <Input
                        className="text-primary-foreground w-full"
                        placeholder="165.3224 in degree"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dec"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="text-primary-foreground flex items-center gap-2">
                            Dec{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1}
                              stroke="currentColor"
                              className="size-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </svg>
                          </FormLabel>
                        </TooltipTrigger>

                        <TooltipContent>
                          Support formats: degrees <br />
                          12h34m56.78s <br />
                          +12 23 28.0436859
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <Input
                        className="text-primary-foreground w-full"
                        placeholder="10:56:28.9208702274"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <TagOptions {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="text-center w-full">
              <Button
                className="w-full text-primary-foreground bg-primary"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <div className="sm:max-w-[425px] lg:max-w-[850px] lg:max-h-[720px]">
                <FileUpload setOpen={setOpen} />
              </div>
            </TooltipTrigger>
            <TooltipContent sideOffset={-50}>
              <p>Must contain columns: name, ra, dec</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}
