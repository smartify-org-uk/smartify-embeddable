import React from "react";
import H2Title from "../../vanilla/H2Title";


type Props = {
    title?: string;
    spacing?: number;
};

export default (props: Props) => {
    const {title, spacing} = props;

    return (
        <div style={{ marginTop: `${spacing}px` }}>
            <H2Title title={title} />
        </div>
    );
};


/*
export default (props: Inputs) => {
    const {title} = props;

    return(
        <div className="w-full" style={{marginTop: '16px', marginBottom: '16px'}}>
            <h2 className="text-[#333942] text-[24px] font-bold">
                {title}
            </h2>
        </div>
    )
}
*/