import React, { useCallback } from "@rbxts/react";
import { useProducer } from "@rbxts/react-reflex";
import { useEffect, useMemo } from "@rbxts/react";
import { ControlGroup, ConvertControl, InferControlType } from "@rbxts/ui-labs";
import { ConvertedControlList, ConvertedControls, ObjectControl, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { InferControlGroup, IntrinsicProps, StoryBase } from "@rbxts/ui-labs/src/Typing/Typing";
import Summary from "UI/StoryPreview/StoryActionRenders/Summary";
import Controls from "UI/StoryPreview/StoryActionRenders/Controls";
import { useInputSignals } from "Context/UserInputContext";

declare global {
	type ControlValue = InferControlType<ObjectControl>;
	type ParametrizedControls = Record<string, ControlValue | InferControlGroup>;
}

function TryConvertControl(control: any): ObjectControl | ControlGroup<ConvertedControlList> | undefined {
	const controlType = typeOf(control);
	if (controlType === "table") {
		return control;
	}

	const [succes, value] = pcall(ConvertControl, control);
	if (!succes) {
		warn(value);
		return undefined;
	}
	return value;
}

function ConvertLiterals(controls: ReturnControls) {
	const converted: ConvertedControls = {};

	for (const [name, control] of pairs(controls)) {
		const finalControl = TryConvertControl(control);
		if (finalControl === undefined) continue;

		if (finalControl.EntryType === "ControlGroup") {
			converted[name] = {
				...finalControl,
				Controls: ConvertLiterals(finalControl.Controls) as ConvertedControlList,
			};
			continue;
		}
		converted[name] = finalControl;
	}
	print("Converted Controls: ", converted);
	return converted;
}

export function useControls(returnedControls: ReturnControls) {
	const controls = useMemo(() => {
		return ConvertLiterals(returnedControls);
	}, [returnedControls]);

	return controls;
}

//This function gets all controls and converts them to a list of values, ready to be send as story props
export function ParametrizeControls(controls: ConvertedControls) {
	const controlValues: ParametrizedControls = {};

	for (const [name, control] of pairs(controls)) {
		if (control.EntryType === "ControlGroup") {
			controlValues[name] = ParametrizeControls(control.Controls) as Record<string, ControlValue>;
			continue;
		}
		controlValues[name] = control.ControlValue;
	}
	return controlValues;
}

export function useStoryActionComponents(
	entry: PreviewEntry,
	result: StoryBase,
	returnControls: ReturnControls,
	controls: ConvertedControls,
	controlValues: ParametrizedControls,
	setControlValues: React.Dispatch<React.SetStateAction<ParametrizedControls>>,
) {
	const { setActionComponent } = useProducer<RootProducer>();

	useEffect(() => {
		if (result.summary !== undefined && result.summary !== "") {
			setActionComponent(entry.Key, "SummaryTab", {
				DisplayName: "Summary",
				Render: <Summary SummaryText={result.summary}></Summary>,
			});
		}
		if (returnControls !== undefined) {
			setActionComponent(entry.Key, "ControlsTab", {
				DisplayName: "Controls",
				Render: <Controls Controls={controls} ControlValues={controlValues} SetControlValues={setControlValues} />,
				Order: 2,
			});
		}
	}, [entry, result, controlValues, returnControls, controls]);
}

type Props = Record<string, any>;

export function useStoryPassedProps() {
	const inputSignals = useInputSignals();

	const GetStoryProps = useCallback(
		<T extends Props>(setProps: T) => {
			const intrinsic: IntrinsicProps = {
				inputListener: inputSignals,
			};

			const props: IntrinsicProps & T = {
				...setProps,
				...intrinsic,
			};
			return props;
		},
		[inputSignals],
	);
	return GetStoryProps;
}
