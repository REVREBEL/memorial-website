import * as React from "react";
import * as Types from "./types";

declare function Navigation(
    props: {
        as?: React.ElementType;
        guestbookLink?: Types.Basic.Link;
        recipesLink?: Types.Basic.Link;
        timelineLink?: Types.Basic.Link;
        timelineText?: React.ReactNode;
        recipesText?: React.ReactNode;
        memoriesText?: React.ReactNode;
        memoriesLink?: Types.Basic.Link;
        homeLink?: Types.Basic.Link;
    }
): React.JSX.Element