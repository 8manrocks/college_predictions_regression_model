import React, { useState } from 'react';

type FormData = {
    "GRE Score": string;
    "TOEFL Score": string;
    "University Rating": string;
    "SOP": string;
    "CGPA": string;
    "Research": boolean;
    "LOR ": string;
};

const PredictionForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        "GRE Score": '',
        "TOEFL Score": '',
        "University Rating": '',
        "SOP": '',
        "CGPA": '',
        "Research": false,
        "LOR ": '',
    });

    const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    const validateAndSubmitFormData = () => {
        // Convert and validate GRE Score
        const greScore = Number(formData["GRE Score"]);
        if (isNaN(greScore) || greScore < 0 || greScore > 340) {
            alert("GRE Score must be between 0 and 340.");
            return null;
        }

        // Convert and validate TOEFL Score
        const toeflScore = Number(formData["TOEFL Score"]);
        if (isNaN(toeflScore) || toeflScore < 0 || toeflScore > 120) {
            alert("TOEFL Score must be between 0 and 120.");
            return null;
        }

        // Convert and validate University Rating
        const universityRating = Number(formData["University Rating"]);
        if (isNaN(universityRating) || universityRating < 1 || universityRating > 5) {
            alert("University Rating must be between 1 and 5.");
            return null;
        }

        // Convert and validate SOP
        const sop = Number(formData["SOP"]);
        if (isNaN(sop) || sop < 1 || sop > 5) {
            alert("SOP must be between 1 and 5.");
            return null;
        }

        // Convert and validate CGPA
        const cgpa = Number(formData["CGPA"]);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            alert("CGPA must be between 0 and 10.");
            return null;
        }

        // Validate Research
        // No need for conversion; it's already a boolean. Just ensure it's included in the final object if needed.

        // Convert and validate LOR
        const lor = Number(formData["LOR "]);
        if (isNaN(lor) || lor < 1 || lor > 5) {
            alert("LOR must be between 1 and 5.");
            return null;
        }
        return {
            "GRE Score": greScore,
            "TOEFL Score": toeflScore,
            "University Rating": universityRating,
            "SOP": sop,
            "CGPA": cgpa,
            "Research": formData.Research ? 1 : 0,
            "LOR ": lor,
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = validateAndSubmitFormData();
        if (!submissionData) return;

        // Replace console.log with your API submission code.
        try {
            const response = await fetch('http://localhost:5000/predict', { // Use your actual API endpoint here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const { prediction } = await response.json();
            alert(`the chance of admission is ${Math.trunc(prediction[0] * 10000) / 100}%`); // Show prediction result in an alert
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to get prediction.');
            return false;
        }
    };

    const handleReset = () => {
        setFormData({
            "GRE Score": '',
            "TOEFL Score": '',
            "University Rating": '',
            "SOP": '',
            "CGPA": '',
            "Research": false,
            "LOR ": '',
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
                <div className="form-element" key={key}>
                    <label>
                        {key}:
                    </label>
                    {key === "Research" ? (
                        <input
                            name={key}
                            type="checkbox"
                            checked={value as boolean}
                            onChange={handleChangeCheckbox}
                        />
                    ) : (
                        <input
                            name={key}
                            type="text" // Changed from "number" to "text"
                            value={value as string}
                            onChange={handleChangeNumber}
                            pattern={key === "CGPA" || key === "SOP" || key === "LOR " ? "\\d*\\.?\\d*" : "\\d*"} // Allow decimals for CGPA
                        />
                    )}
                </div>
            ))}
            <button type="submit">Submit</button>
            <button type="button" onClick={handleReset}>Reset</button>
        </form>
    );
}
export default PredictionForm;