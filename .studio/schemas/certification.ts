export default defineSchema({
  title: "Certification",
  description: "Professional certifications",
  icon: "heroicons:document-check",
  collection: "certifications",
  schema: {
    title: {
      title: "Certification Title",
      type: "string",
      required: true
    },
    website: {
      title: "Website",
      type: "string"
    },
    date: {
      title: "Date",
      type: "string",
      required: true
    },
    credlyBadgeUrl: {
      title: "Credly Badge URL",
      type: "string"
    },
    badgeImage: {
      title: "Badge Image Filename",
      type: "string",
      required: true
    },
    badgeAlt: {
      title: "Badge Alt Text",
      type: "string",
      required: true
    },
    imageHeight: {
      title: "Image Height",
      type: "string"
    },
    imageWidth: {
      title: "Image Width",
      type: "string"
    },
    description: {
      title: "Description",
      type: "string",
      format: "markdown"
    },
    skills: {
      title: "Skills",
      type: "string",
      format: "markdown"
    },
    recap: {
      title: "Recap",
      type: "string",
      format: "markdown"
    },
    details: {
      title: "Details",
      type: "string",
      format: "markdown"
    }
  }
});