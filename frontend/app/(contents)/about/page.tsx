import { BugForm } from "./bugForm";
import PersonCard from "./personCard";

const contributors = [
  {
    name: "Pan Yen Chen",
    image: "/ycpan.jpg",
    title: "Professor",
    site: "https://sites.google.com/view/ycpan/home",
    twitter: "",
    facebook: "",
    github: "",
  },
  {
    name: "Tyler",
    image: "/tyler.JPG",
    site: "https://tylerastro.github.io",
    title: "Developer",
    twitter: "",
    github: "https://github.com/Tylerastro",
  },
];

export default function page() {
  return (
    <>
      <section className="h-90vh" id="Developers">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-primary-foreground">
              Our team
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              If you encounter any problem with the site, please report it to
              us.
              <br />
              <a href="https://github.com/Tylerastro/NCU_TOM/issues">
                Issues page
              </a>
            </p>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              {`We welcom you to submit PRs to the project:`}{" "}
              <a href="https://github.com/Tylerastro/NCU_TOM">@NCU_TOM</a>{" "}
            </p>
          </div>
          <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {contributors.map((contributor) => (
              <PersonCard
                key={contributor.name}
                name={contributor.name}
                site={contributor.site}
                title={contributor.title}
                image={contributor.image}
                facebook={contributor.facebook ? contributor.facebook : ""}
                twitter={contributor.twitter ? contributor.twitter : ""}
                github={contributor.github ? contributor.github : ""}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="h-90vh" id="Contributors">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-primary-foreground">
              Contributors
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              We gratefully thank all of our contributors. Here, we list all the
              contributors to this project.
            </p>
          </div>
          <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
        </div>
      </section>
      <section className="h-screen" id="Bugs">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-primary-foreground">
              Found a bug? Report it!
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              {`Great job! We're happy to receive bug reports and fix them.`}
            </p>
            <div className="text-left py-4">
              <BugForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
