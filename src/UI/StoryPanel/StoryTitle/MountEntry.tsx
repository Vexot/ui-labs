import React, { useCallback, useEffect } from "@rbxts/react";
import { useProducer, useSelector } from "@rbxts/react-reflex";
import { useMouseOffset } from "Hooks/Context/UserInput";
import { useTheme } from "Hooks/Reflex/Use/Theme";
import { useToggler } from "Hooks/Utils/Toggler";
import Config from "Plugin/Configs";
import { selectNodeFromModule } from "Reflex/Explorer/Nodes";
import { selectStorySelected } from "Reflex/StorySelection";
import PreviewDropdown from "UI/Overlays/Dropdown/PreviewDropdown";
import Corner from "UI/Styles/Corner";
import { Detector } from "UI/Styles/Detector";
import { Div } from "UI/Styles/Div";
import LeftList from "UI/Styles/List/LeftList";
import Padding from "UI/Styles/Padding";
import Text from "UI/Styles/Text";
import DescriptiveImage from "./DescriptiveImage";
import Sprite from "UI/Utils/Sprite";
import { useDescriptionDisplay } from "Context/DescriptionContext";
import { Counter } from "Utils/NumberUtils";
import { useUnmountEffect } from "@rbxts/pretty-react-hooks";

interface MountEntryProps {
	PreviewEntry: PreviewEntry;
}

function MountEntry(props: MountEntryProps) {
	const [hovered, hoverApi] = useToggler(false);
	const [closeHovered, closeHoverApi] = useToggler(false);
	const count = Counter();

	const entry = props.PreviewEntry;
	const { DisplayDescription, RemoveDescription } = useDescriptionDisplay("MountCloseButton");
	const node = useSelector(selectNodeFromModule(entry.Module));
	const selectedEntry = useSelector(selectStorySelected);
	const { selectStory, setPopup, resetIdentifiedOverlay, unmountStory } = useProducer<RootProducer>();

	const theme = useTheme();
	const mouseOffset = useMouseOffset();

	const selected = selectedEntry === entry.Key;
	const isMain = entry.Key === Config.RootPreviewKey;

	const OnEntryClicked = useCallback(() => {
		selectStory(entry.Key);
	}, [entry]);

	const OnEntryClosed = useCallback(() => {
		unmountStory(entry.Key);
	}, [entry]);

	const OnEntryDropdown = useCallback(() => {
		const offset = mouseOffset.getValue();
		setPopup("PreviewDropdown", <PreviewDropdown Position={offset} PreviewEntry={entry} />, entry.UID);
	}, [mouseOffset, entry]);

	useEffect(() => {
		if (closeHovered) {
			DisplayDescription("Unmount Story");
		} else {
			RemoveDescription();
		}
	}, [closeHovered]);

	useUnmountEffect(() => {
		resetIdentifiedOverlay(entry.UID);
	});

	return (
		<Detector
			key={"Entry"}
			AutomaticSize={Enum.AutomaticSize.X}
			BackgroundColor3={selected ? theme.StoryPreview.Selected : theme.StoryPreview.Color}
			BackgroundTransparency={0}
			LayoutOrder={entry.Order}
			BorderSizePixel={0}
			Size={UDim2.fromScale(0, 1)}
			Event={{
				MouseEnter: hoverApi.enable,
				MouseLeave: hoverApi.disable,
				MouseButton1Click: OnEntryClicked,
				MouseButton2Click: OnEntryDropdown,
			}}
		>
			<Corner Radius={8} />
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={Color3.fromRGB(180, 180, 180)}
				Transparency={hovered ? 0.5 : 1}
			/>
			<frame
				key={"HiddenCover"}
				ZIndex={5}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={theme.StoryPreview.Background}
				BackgroundTransparency={0.65}
				Visible={!entry.Visible}
				Active={false}
			>
				<Corner Radius={6} />
			</frame>
			<Div key={"Holder"}>
				<Padding PaddingX={8} />
				<LeftList VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 5)} />
				<Text
					key={"TextLabel"}
					Text={(isMain ? "• " : "") + (node ? node.Name : "(Deleted)")}
					TextSize={14}
					LayoutOrder={count()}
					TextColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
					TextXAlignment={Enum.TextXAlignment.Left}
					AutomaticSize={Enum.AutomaticSize.X}
					Size={UDim2.fromScale(0, 1)}
				>
					<Padding Right={3} />
				</Text>
				{entry.OnWidget && (
					<Div key={"OnWidget"} Size={UDim2.fromOffset(12, 12)} LayoutOrder={count()}>
						<DescriptiveImage
							ImageName="WidgetIcon"
							Description={"In Widget"}
							Image={"rbxassetid://16442161953"}
							ImageColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
							ScaleType={Enum.ScaleType.Fit}
							BackgroundTransparency={1}
							ImageTransparency={0.4}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={UDim2.fromOffset(15, 15)}
						/>
					</Div>
				)}
				{!entry.Visible && (
					<Div key={"Hidden"} Size={UDim2.fromOffset(14, 14)} LayoutOrder={count()}>
						<DescriptiveImage
							ImageName="HiddenIcon"
							Description={"Hidden"}
							Image={"rbxassetid://16158493311"}
							ImageColor3={selected ? theme.StoryPreview.TextSelected : theme.Text.Color}
							ScaleType={Enum.ScaleType.Fit}
							BackgroundTransparency={1}
							ImageTransparency={0.3}
							Position={UDim2.fromScale(0.5, 0.5)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={UDim2.fromOffset(14, 14)}
						/>
					</Div>
				)}

				<frame
					key={"CloseFrame"}
					LayoutOrder={count()}
					Size={UDim2.fromOffset(17, 17)}
					BackgroundTransparency={closeHovered ? (selected ? 0.4 : 0.65) : 1}
					BackgroundColor3={theme.StoryPreview.CloseButton}
				>
					<Corner Radius={6} />
					<Sprite
						key={"CloseIcon"}
						Sprite="Close"
						ImageProps={{
							ImageColor3: selected ? theme.StoryPreview.TextSelected : theme.Text.Color,
							ScaleType: Enum.ScaleType.Fit,
							Position: UDim2.fromScale(0.5, 0.5),
							AnchorPoint: new Vector2(0.5, 0.5),
							Size: UDim2.fromOffset(13, 13),
						}}
					/>
					<Detector
						Event={{
							MouseEnter: closeHoverApi.enable,
							MouseLeave: closeHoverApi.disable,
							MouseButton1Click: OnEntryClosed,
						}}
					/>
				</frame>
			</Div>
		</Detector>
	);
}

export default MountEntry;
