import * as React from "react";
import * as Types from "./types";

declare function Stories(
    props: {
        as?: React.ElementType;
        featuredFeaturedTitle?: React.ReactNode;
        featuredFeaturedTitleTag?: Types.Basic.HeadingTag;
        featuredText?: React.ReactNode;
        featuredTagText?: React.ReactNode;
        smallFeature1TagText?: React.ReactNode;
        smallFeature1Title?: React.ReactNode;
        smallFeature1TitleTag?: Types.Basic.HeadingTag;
        smallFeature1BodyText?: React.ReactNode;
        smallFeature2TagText?: React.ReactNode;
        smallFeature2Title?: React.ReactNode;
        smallFeature2TitleTag?: Types.Basic.HeadingTag;
        smallFeature2Text?: React.ReactNode;
        smallFeature2Image?: Types.Asset.Image;
        smallFeature1Image?: Types.Asset.Image;
        textFeature1TagText?: Types.Basic.HeadingTag;
        textFeature1Title?: React.ReactNode;
        textFeature1Text?: React.ReactNode;
        textFeature2TagText?: Types.Basic.HeadingTag;
        textFeature2Title?: React.ReactNode;
        textFeature2Text?: React.ReactNode;
        textFeature3Title?: React.ReactNode;
        textFeature3TitleTag?: Types.Basic.HeadingTag;
        textFeature3Text?: React.ReactNode;
        textFeature4Tag?: Types.Basic.HeadingTag;
        textFeature5Tag?: Types.Basic.HeadingTag;
        textFeature5Text?: React.ReactNode;
        textFeature5Text2?: React.ReactNode;
        textFeature4Title?: React.ReactNode;
        textFeature5Title?: React.ReactNode;
        textFeature5Visibility?: Types.Visibility.VisibilityConditions;
        textFeature4Visibility?: Types.Visibility.VisibilityConditions;
        textFeature3Visibility?: Types.Visibility.VisibilityConditions;
        textFeature2Visibility?: Types.Visibility.VisibilityConditions;
        textFeature1Visibility?: Types.Visibility.VisibilityConditions;
        textFeature1Link?: Types.Basic.Link;
        textFeature2Link?: Types.Basic.Link;
        textFeature3Link?: Types.Basic.Link;
        textFeature4Link?: Types.Basic.Link;
        textFeature5Link?: Types.Basic.Link;
        smallFeature1Visibility?: Types.Visibility.VisibilityConditions;
        smallFeature1Link?: Types.Basic.Link;
        smallFeature2Visibility?: Types.Visibility.VisibilityConditions;
        smallFeature2Link?: Types.Basic.Link;
        featuredImage?: Types.Asset.Image;
        smallFeature2AltText?: Types.Basic.AltText;
        smallFeature1AltText?: Types.Basic.AltText;
        featuredAltText?: Types.Basic.AltText;
    }
): React.JSX.Element