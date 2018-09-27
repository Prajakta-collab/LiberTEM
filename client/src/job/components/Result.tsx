import * as React from "react";
import { connect } from "react-redux";
import * as analysisActions from '../../analysis/actions';
import { AnalysisState } from "../../analysis/types";
import { AnalysisTypes, DatasetState } from "../../messages";
import BusyWrapper from "../../widgets/BusyWrapper";
import { inRectConstraint } from "../../widgets/constraints";
import DraggableHandle from "../../widgets/DraggableHandle";
import HandleParent from "../../widgets/HandleParent";
import { JobState } from "../types";
import ResultImage from "./ResultImage";

interface ResultProps {
    width: number,
    height: number,
    job: JobState,
    dataset: DatasetState,
    analysis: AnalysisState,
    idx: number,
}


const mapDispatchToProps = {
    updateParameters: analysisActions.Actions.updateParameters,
};

type MergedProps = ResultProps & DispatchProps<typeof mapDispatchToProps>;

class Result extends React.Component<MergedProps> {
    public onCenterChange = (x: number, y: number) => {
        this.props.updateParameters(this.props.analysis.id, {
            x: Math.round(x),
            y: Math.round(y)
        }, "FRAME");
    }

    public renderPickHandles() {
        const { analysis, width, height } = this.props;
        if (analysis.preview.type !== AnalysisTypes.PICK_FRAME) {
            return null;
        }
        const { x, y } = analysis.preview.parameters;
        return (
            <HandleParent width={width} height={height}>
                <DraggableHandle x={x} y={y} withCross={true}
                    imageWidth={width}
                    onDragMove={this.onCenterChange}
                    constraint={inRectConstraint(width, height)} />
            </HandleParent>
        );
    }

    public render() {
        const { job, idx, width, height } = this.props;
        const busy = job.running !== "DONE";

        return (
            <BusyWrapper busy={busy}>
                <svg style={{ display: "block", border: "1px solid black", width: "100%", height: "auto" }} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                    <ResultImage job={job} idx={idx} width={width} height={height} />
                    {this.renderPickHandles()}
                </svg>
            </BusyWrapper>
        );
    }
};

export default connect(null, mapDispatchToProps)(Result);