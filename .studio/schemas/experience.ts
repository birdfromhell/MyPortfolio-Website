export default defineSchema({
  title: "Experience",
  description: "Work experience entries",
  icon: "heroicons:briefcase",
  collection: "experiences",
  schema: {
    company: {
      title: "Company Name",
      type: "string",
      required: true
    },
    companyUrl: {
      title: "Company Website",
      type: "string"
    },
    position: {
      title: "Position",
      type: "string",
      required: true
    },
    period: {
      title: "Period",
      type: "object",
      schema: {
        start: { title: "Start Date", type: "string", required: true },
        end: { title: "End Date", type: "string", required: true }
      }
    },
    type: {
      title: "Employment Type",
      type: "select",
      options: ["internship", "apprenticeship", "freelance", "job"],
      required: true
    },
    technologies: {
      title: "Technologies Used",
      type: "array",
      items: { type: "string" }
    },
    content: {
      title: "Content",
      type: "multilanguage",
      languages: ["en", "id"],
      format: "markdown"
    }
  }
});