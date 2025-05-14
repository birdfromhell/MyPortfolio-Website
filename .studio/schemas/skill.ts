export default defineSchema({
  title: "Skill",
  description: "Technical skills",
  icon: "heroicons:academic-cap",
  collection: "skills",
  schema: {
    title: {
      title: "Skill Name",
      type: "string",
      required: true
    },
    type: {
      title: "Type",
      type: "select",
      options: ["language", "framework", "library", "database", "development-tool", "devops", "apis-integration"],
      required: true
    },
    url: {
      title: "URL",
      type: "string"
    },
    icon: {
      title: "Icon",
      type: "string",
      required: true
    }
  }
});