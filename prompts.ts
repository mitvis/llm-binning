function first_prompt(): string {
    const prompt = "For each field in the data, create a JSON object with keys 'field_name' and 'type' (quantitative,  nominal, ordinal, temporal).";
    return prompt;
}

function second_prompt(): string {
    let prompt = "For each field, can you create non-obvious binnings that include the semantic meaning of the data with in the following format? Please make sure each bin can be mapped to the original data.\n ";
    return prompt;
}

function third_prompt(): string {
    let prompt = "For each field, can you create non-obvious binnings that include the semantic meaning of the data with in the following format? Please make sure each bin can be mapped to the original data.\n ";
    return prompt;
}