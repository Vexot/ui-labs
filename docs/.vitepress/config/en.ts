import { defineConfig } from "vitepress";

export default defineConfig({
	description: "Storybook plugin for Roblox",
	lang: "en-US",

	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Get Started", link: "/docs/getstarted" },
			{ text: "API", link: "/api/home" },
		],

		sidebar: {
			"/docs/": [
				{
					text: "Get Started",
					items: [
						{ text: "Introduction", link: "/docs/getstarted" },
						{ text: "Installation", link: "/docs/installation" },
					],
				},
				{
					text: "Stories",
					collapsed: false,
					items: [
						{ text: "Creating Stories", link: "/docs/stories/create" },
						{ text: "Function Stories", link: "/docs/stories/function" },
						{
							text: "Advanced Stories",
							link: "/docs/stories/advanced/index",
							items: [
								{ text: "React / Roact Stories", link: "/docs/stories/advanced/react" },
								{ text: "Fusion Stories", link: "/docs/stories/advanced/fusion" },
                        { text: "Vide Stories", link: "/docs/stories/advanced/vide" },
                        { text: "Iris Stories", link: "/docs/stories/advanced/iris" },
								{ text: "Generic Stories", link: "/docs/stories/advanced/generic" },
							],
						},
					],
				},
				{
					text: "Using UI Labs",
					collapsed: false,
					items: [
						{ text: "Visualizing Stories", link: "/docs/plugin/visualizing" },
						{ text: "Multi-Mounting", link: "/docs/plugin/multimounting" },
                  { text: "Story Tools", link: "/docs/plugin/tools" },
						{ text: "Extra Features", link: "/docs/plugin/extras" },
					],
				},
				{
					text: "Controls",
					collapsed: false,
					items: [
						{ text: "Adding Controls", link: "/docs/controls/adding" },
						{ text: "Primitive Controls", link: "/docs/controls/primitive" },
						{ text: "Advanced Controls", link: "/docs/controls/advanced" },
						{ text: "Using Controls", link: "/docs/controls/using" },
					],
				},
				{
					text: "Storybooks",
					link: "/docs/storybooks",
				},
				{
					text: "Environment",
					link: "/docs/environment",
				},
			],
			"/api/": [
				{ text: "API Reference", items: [] },
				{
					text: "Stories",
					collapsed: false,
					items: [
						{ text: "Function Story", link: "/api/stories/function" },
						{ text: "Advanced Story", link: "/api/stories/advanced" },
					],
				},
				{
					text: "Primitive Controls",
					link: "/api/primitives",
				},
				{
					text: "UI Libraries",
					link: "/api/uilibraries",
				},
				{
					text: "Storybook",
					link: "/api/storybook",
				},
				{
					text: "Utility Package",
					collapsed: false,
					items: [
						{ text: "Story Creators", link: "/api/utility/storycreators" },
						{
							text: "Control Constructors",
							items: [
								{ text: "Primitives", link: "/api/utility/controls/primitives" },
								{ text: "Advanced", link: "/api/utility/controls/advanced" },
							],
						},
						{ text: "Utils", link: "/api/utility/utils" },
						{ text: "Environment", link: "/api/utility/environment" },
						{ text: "Types", link: "/api/utility/types" },
					],
				},
			],
		},
	},
});
