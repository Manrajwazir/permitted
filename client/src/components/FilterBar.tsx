import { ContextOption } from '../services/api';
import './FilterBar.css';

interface FilterBarProps {
    stages: ContextOption[];
    provinces: ContextOption[];
    programs: ContextOption[];
    selectedStage: string;
    selectedProvince: string;
    selectedProgram: string;
    onStageChange: (value: string) => void;
    onProvinceChange: (value: string) => void;
    onProgramChange: (value: string) => void;
}

export default function FilterBar({
    stages,
    provinces,
    programs,
    selectedStage,
    selectedProvince,
    selectedProgram,
    onStageChange,
    onProvinceChange,
    onProgramChange,
}: FilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label htmlFor="stage-filter">Stage</label>
                <select
                    id="stage-filter"
                    value={selectedStage}
                    onChange={(e) => onStageChange(e.target.value)}
                >
                    <option value="">All Stages</option>
                    {stages.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="province-filter">Province</label>
                <select
                    id="province-filter"
                    value={selectedProvince}
                    onChange={(e) => onProvinceChange(e.target.value)}
                >
                    <option value="">All Provinces</option>
                    {provinces.map((p) => (
                        <option key={p.value} value={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="program-filter">Program</label>
                <select
                    id="program-filter"
                    value={selectedProgram}
                    onChange={(e) => onProgramChange(e.target.value)}
                >
                    <option value="">All Programs</option>
                    {programs.map((p) => (
                        <option key={p.value} value={p.value}>
                            {p.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
