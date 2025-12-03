globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, h as addAttribute, k as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_C6yUJjNp.mjs';
/* empty css                             */
/* empty css                             */
/* empty css                             */
import { j as jsxRuntimeExports, B as Block, N as NavbarWrapper, L as Link, I as Image, H as HtmlEmbed, D as DevLinkProvider, S as Section, a as Heading, b as Span, P as Paragraph } from './BackgroundVideo_B_k8Rqzf.mjs';
import './_@astro-renderers_1Hg5a3QD.mjs';

const $$Astro = createAstro();
const $$Main = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Main;
  const { pageClass = "" } = Astro2.props;
  return renderTemplate`<html lang="en"${addAttribute(pageClass, "class")}> <head><meta charset="utf-8"><link rel="icon" type="image/png" href="/favicon.ico"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Memory Journal</title>${renderHead()}</head> <!-- Dark mode class injection point - will be replaced with \`dark\` class based on your site palette --> <body class="__DARK_MODE_CLASS__"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/app/src/layouts/main.astro", void 0);

function Navigation({
  as: _Component = Block
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(_Component, { className: "nav", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    NavbarWrapper,
    {
      className: "nav_container",
      tag: "div",
      "data-animation": "default",
      "data-easing2": "ease",
      "data-easing": "ease",
      "data-collapse": "medium",
      role: "banner",
      "data-no-scroll": "1",
      "data-duration": "400",
      config: {
        easing: "ease",
        easing2: "ease",
        duration: 400,
        docHeight: false,
        noScroll: true,
        animation: "default",
        collapse: "medium"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Block,
          {
            className: "nav_left",
            id: "w-node-_29ecd6d6-2746-86af-d2e8-9776c008cd03-c008cd01",
            tag: "div",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                className: "link-block",
                button: false,
                block: "inline",
                options: {
                  href: "#"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "home-button navbar", tag: "div", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      className: "monogram is-hidden-mobile-l",
                      loading: "lazy",
                      width: "auto",
                      height: "auto",
                      alt: "",
                      src: "https://cdn.prod.website-files.com/69219eaa23d0fd8b7effe1fe/692cd0f0d0828d09b5d4ed3b_monogram.png"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      className: "monogram is-hidden-desktop",
                      loading: "lazy",
                      width: "auto",
                      height: "auto",
                      alt: "",
                      src: "https://cdn.prod.website-files.com/69219eaa23d0fd8b7effe1fe/692d37eb0a034be758da1e95_monogram-wide.png"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Image,
                    {
                      className: "monogram is-hidden-mobble-p",
                      loading: "lazy",
                      width: "auto",
                      height: "auto",
                      alt: "",
                      src: "https://cdn.prod.website-files.com/69219eaa23d0fd8b7effe1fe/692d3a3dd9e65282117016c6_monogram-mobile.png"
                    }
                  )
                ] })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Block,
          {
            className: "nav_right",
            id: "w-node-_29ecd6d6-2746-86af-d2e8-9776c008cdae-c008cd01",
            tag: "div",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  className: "button_link-block",
                  button: false,
                  block: "inline",
                  options: {
                    href: "/memory-journal"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "tag", tag: "div", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      HtmlEmbed,
                      {
                        className: "button_icon",
                        value: "%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2225px%22%20height%3D%2225px%22%20stroke-width%3D%221.5%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20color%3D%22currentColor%22%3E%3Cpath%20d%3D%22M22%208.86222C22%2010.4087%2021.4062%2011.8941%2020.3458%2012.9929C17.9049%2015.523%2015.5374%2018.1613%2013.0053%2020.5997C12.4249%2021.1505%2011.5042%2021.1304%2010.9488%2020.5547L3.65376%2012.9929C1.44875%2010.7072%201.44875%207.01723%203.65376%204.73157C5.88044%202.42345%209.50794%202.42345%2011.7346%204.73157L11.9998%205.00642L12.2648%204.73173C13.3324%203.6245%2014.7864%203%2016.3053%203C17.8242%203%2019.2781%203.62444%2020.3458%204.73157C21.4063%205.83045%2022%207.31577%2022%208.86222Z%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button_label", tag: "div", children: "Share a Memory" })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Block,
                {
                  className: "button",
                  id: "w-node-_072c5ad0-617a-b53b-de8b-8f4f03b136c7-c008cd01",
                  tag: "div",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      className: "button_link-block",
                      button: false,
                      block: "inline",
                      options: {
                        href: "/guestbook"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "tag", tag: "div", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          HtmlEmbed,
                          {
                            className: "button_icon",
                            value: "%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2225px%22%20height%3D%2225px%22%20stroke-width%3D%221.5%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20color%3D%22currentColor%22%3E%3Cpath%20d%3D%22M12%2021V7C12%205.89543%2012.8954%205%2014%205H21.4C21.7314%205%2022%205.26863%2022%205.6V18.7143%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M12%2021V7C12%205.89543%2011.1046%205%2010%205H2.6C2.26863%205%202%205.26863%202%205.6V18.7143%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M14%2019L22%2019%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M10%2019L2%2019%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M12%2021C12%2019.8954%2012.8954%2019%2014%2019%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M12%2021C12%2019.8954%2011.1046%2019%2010%2019%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button_label", tag: "div", children: "Guestbook" })
                      ] })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  className: "button_link-block",
                  button: false,
                  block: "inline",
                  options: {
                    href: "#"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "tag", tag: "div", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      HtmlEmbed,
                      {
                        className: "button_icon",
                        value: "%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2225px%22%20height%3D%2225px%22%20stroke-width%3D%221.5%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20color%3D%22currentColor%22%3E%3Cpath%20d%3D%22M11.9996%2014.9995C13.6565%2014.9995%2014.9996%2013.6564%2014.9996%2011.9995C14.9996%2010.3427%2013.6565%208.99951%2011.9996%208.99951C10.3428%208.99951%208.99963%2010.3427%208.99963%2011.9995C8.99963%2013.6564%2010.3428%2014.9995%2011.9996%2014.9995Z%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M13%209C13%209%2014%207%2014%205C14%203%2012%201%2012%201C12%201%2010%203%2010%205C10%207%2011%209%2011%209%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M9%2011C9%2011%207%2010%205%2010C3%2010%201%2012%201%2012C1%2012%203%2014%205%2014C7%2014%209%2013%209%2013%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M13%2015C13%2015%2014%2017%2014%2019C14%2021%2012%2023%2012%2023C12%2023%2010%2021%2010%2019C10%2017%2011%2015%2011%2015%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M15%2011C15%2011%2017%2010%2019%2010C21%2010%2023%2012%2023%2012C23%2012%2021%2014%2019%2014C17%2014%2015%2013%2015%2013%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M10.5858%209.17176C10.5858%209.17176%209.87868%207.05044%208.46447%205.63623C7.05026%204.22202%204.22183%204.22202%204.22183%204.22202C4.22183%204.22202%204.22183%207.05044%205.63604%208.46466C7.05026%209.87887%209.17158%2010.586%209.17158%2010.586%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M9.17152%2013.4142C9.17152%2013.4142%207.0502%2014.1213%205.63599%2015.5355C4.22177%2016.9497%204.22177%2019.7782%204.22177%2019.7782C4.22177%2019.7782%207.0502%2019.7782%208.46441%2018.364C9.87863%2016.9497%2010.5857%2014.8284%2010.5857%2014.8284%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M14.8285%2013.4142C14.8285%2013.4142%2016.9498%2014.1213%2018.364%2015.5355C19.7782%2016.9497%2019.7782%2019.7782%2019.7782%2019.7782C19.7782%2019.7782%2016.9498%2019.7782%2015.5356%2018.364C14.1214%2016.9497%2013.4143%2014.8284%2013.4143%2014.8284%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M13.4142%209.17176C13.4142%209.17176%2014.1213%207.05044%2015.5355%205.63623C16.9497%204.22202%2019.7782%204.22202%2019.7782%204.22202C19.7782%204.22202%2019.7782%207.05044%2018.364%208.46466C16.9497%209.87887%2014.8284%2010.586%2014.8284%2010.586%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-miterlimit%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button_label", tag: "div", children: "Life Events" })
                  ] })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  className: "button_link-block",
                  button: false,
                  block: "inline",
                  options: {
                    href: "#"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "tag", tag: "div", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      HtmlEmbed,
                      {
                        className: "button_icon",
                        value: "%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20width%3D%2225px%22%20height%3D%2225px%22%20stroke-width%3D%221.5%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20color%3D%22currentColor%22%3E%3Cpath%20d%3D%22M12%2022C17.5%2022%2022%2017.5%2022%2012C22%206.5%2017.5%202%2012%202M12%2022C6.5%2022%202%2017.5%202%2012C2%206.5%206.5%202%2012%202M12%2022V12M12%202V12M12%2012L17%2017.5M12%2012L17%207M12%2012H19%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "button_label", tag: "div", children: "Recipes" })
                  ] })
                }
              ) })
            ]
          }
        )
      ]
    }
  ) });
}

function NavigationWrapper() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DevLinkProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, {}) });
}

function Footer({
  as: _Component = Section
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(_Component, { className: "footer position_relative is-inverse", tag: "footer", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "container footer", tag: "div", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "footer-statment margin-block_medium", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Heading, { className: "statement text-align_right", tag: "h2", children: [
        "she will ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Span, { className: "heading-accent", children: "always " }),
        "be in our hearts",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {})
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "footer-logo-wrapper", tag: "div", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "footer-content-block", tag: "div", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Block, { className: "flex_horizontal hero-eyebrow", tag: "div", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Heading,
              {
                className: "hero_font-sub-text custom-placement text-color-green footer",
                tag: "h1",
                children: "in"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Heading, { className: "hero_heading is-custom-font text-color-green footer", tag: "h1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Span, { className: "hero_special-letter", children: "l" }),
              "oving"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { className: "hero_font-sub-text text-color-green footer", tag: "h1", children: "memoryof" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { className: "hero_heading text-color-green footer", tag: "h2", children: "PatriciaLanning" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { className: "hero_font-sub-text text-color-green footer date", children: "1960-2025" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "footer_link-scroll-up", tag: "div", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        className: "footer_link on-inverse",
        button: false,
        block: "inline",
        options: {
          href: "#"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { className: "back-to-top", tag: "div", children: "Back to top" })
      }
    ) })
  ] });
}

function FooterWrapper() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DevLinkProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}) });
}

export { $$Main as $, FooterWrapper as F, NavigationWrapper as N };
