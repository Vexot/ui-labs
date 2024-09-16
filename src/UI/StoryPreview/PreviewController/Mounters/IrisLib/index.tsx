import React, { useMemo, useState } from "@rbxts/react";
import { MounterProps } from "..";
import { ConvertedControls, ReturnControls } from "@rbxts/ui-labs/src/ControlTypings/Typing";
import { ParametrizeControls, useControls, useStoryPassedProps } from "../Utils";
import { CreateIrisStates, CreateUserInputMock, SetupIris, UpdateIrisStates } from "./Utils";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { InferIrisProps } from "@rbxts/ui-labs";

function IrisLib(props: MounterProps<"IrisLib">) {
	const result = props.Result;
	const uisMock = CreateUserInputMock(props.MountFrame);

	const returnControls = result.controls as ReturnControls;
	const controls = useControls(returnControls ?? {});
	const [controlValues, setControlValues] = useState(ParametrizeControls(controls));
	const GetProps = useStoryPassedProps();

	const irisStates = useMemo(() => {
		result.iris.Init();
		return CreateIrisStates(result.iris, controls, controlValues);
	}, []);

	useUpdateEffect(() => {
		UpdateIrisStates(irisStates, controls, controlValues);
	}, [controlValues]);

	const cleanup = useMemo(() => {
		SetupIris(result.iris, props.MountFrame, uisMock);

		const irisProps: InferIrisProps<ConvertedControls> = GetProps({
			controls: irisStates,
			target: props.MountFrame,
		});

		const [success, value] = pcall(() => result.story(irisProps));
	}, []);

	return <></>;
}

export default IrisLib;
