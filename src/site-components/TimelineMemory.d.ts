import * as React from "react";
import * as Types from "./types";

declare function TimelineMemory(
    props: {
        as?: React.ElementType;
        image1Image?: Types.Asset.Image;
        image2AltText?: Types.Basic.AltText;
        image2Image?: Types.Asset.Image;
        image1AltText?: Types.Basic.AltText;
        eventEventDate?: React.ReactNode;
        eventSubheadline?: React.ReactNode;
        eventHeadline?: React.ReactNode;
        eventHeadlineTag?: Types.Basic.HeadingTag;
        eventSubheadlineTag?: Types.Basic.HeadingTag;
        eventEventText?: React.ReactNode;
        image1Visibility?: Types.Visibility.VisibilityConditions;
        image2Visibility?: Types.Visibility.VisibilityConditions;
        eventSubheadlineVisibility?: Types.Visibility.VisibilityConditions;
    }
): React.JSX.Element