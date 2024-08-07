import React from "react";
import { Inputs } from "./SmartifyH2Title.emb";
import H2Title from "../../vanilla/H2Title";


export default (props: Inputs) => {
    const {title} = props;

    return <H2Title title={title} />
}


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