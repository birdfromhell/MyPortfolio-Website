export default defineSchema({
  title: "Education",
  description: "Education entries",
  icon: "heroicons:academic-cap",
  collection: "education",
  schema: {
    institution: {
      title: "Institution",
      type: "string",
      required: true
    },
    website: {
      title: "Website",
      type: "string"
    },
    degree: {
      title: "Degree",
      type: "string",
      required: true
    },
    period: {
      title: "Period",
      type: "object",
      schema: {
        start: { title: "Start Year", type: "string", required: true },
        end: { title: "End Year", type: "string", required: true }
      }
    },
    location: {
      title: "Location",
      type: "string"
    },
    content: {
      title: "Description",
      type: "multilanguage",
      languages: ["en", "id"],
      format: "markdown"
    }
  }
});