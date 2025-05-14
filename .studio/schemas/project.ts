export default defineSchema({
  title: "Project",
  description: "Portfolio projects",
  icon: "heroicons:code-bracket",
  collection: "projects",
  schema: {
    name: {
      title: "Project Name",
      type: "string",
      required: true
    },
    link: {
      title: "Live Demo URL",
      type: "string"
    },
    repo_link: {
      title: "Repository URL",
      type: "string"
    },
    date: {
      title: "Date",
      type: "string",
      required: true
    },
    technos: {
      title: "Technologies",
      type: "array",
      items: { type: "string" }
    },
    type: {
      title: "Project Type",
      type: "array",
      items: {
        type: "select",
        options: ["favorite", "game", "web", "dev-tool", "scripting"]
      }
    },
    content: {
      title: "Description",
      type: "multilanguage",
      languages: ["en", "id", "fr"],
      format: "markdown"
    }
  }
});