import { lerp } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import { useTween } from "Hooks/Utils/Tween";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import TopList from "UI/Styles/List/TopList";
import Rounder from "UI/Styles/Rounder";
import SpriteButton from "UI/Utils/SpriteButton";
import { Counter } from "Utils/NumberUtils";
import RenderToolButtons from "./Buttons.tsx";
import { selectOverlay } from "Reflex/Overlay.js";

interface LeftToolbarProps {
	PreviewEntry: PreviewEntry;
}

const HOVER_INFO = new TweenInfo(0.15, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);

function LeftToolbar(props: LeftToolbarProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [hoverAlpha, tweenHoverAlpha] = useTween(HOVER_INFO, 0);
	const overlay = useSelector(selectOverlay);

	const isBlocked = overlay && overlay.Identifier === "ButtonDropdown";
	const isShowing = isBlocked || hovered;

	useEffect(() => {
		tweenHoverAlpha(isShowing ? 1 : 0);
	}, [isShowing]);

	return (
		<Div
			key={"IconToolbar"}
			Size={UDim2.fromOffset(35, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromOffset(5, 5)}
			ZIndex={2}
			ClipsDescendants={true}
		>
			<Detector
				Size={new UDim2(0, 35, 1, 0)}
				Event={{
					MouseEnter: hoverApi.enable,
					MouseLeave: hoverApi.disable,
				}}
			/>
			<RenderToolButtons PreviewEntry={props.PreviewEntry} HoverAlpha={hoverAlpha.map((a) => UDim2.fromScale(-1 + a, 0))} />
			<frame
				key={""}
				Size={new UDim2(0, 3, 1, -8)}
				Position={UDim2.fromOffset(0, 4)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={hoverAlpha.map((a) => lerp(0.9, 1, a))}
				ZIndex={2}
			>
				<Rounder />
			</frame>
		</Div>
	);
}

export default LeftToolbar;
