export interface GenderCount {
  male: number;
  female: number;
  other: number;
  unknown: number;
}

export interface ClassStrength extends GenderCount {
  classId: string;
  name: string;
  total: number;
}

export interface SchoolStrength {
  generatedAt: string;
  students: {
    total: number;
    byGender: GenderCount;
    byStatus: Record<string, number>;
    classes: ClassStrength[];
    unassigned: GenderCount & { total: number };
  };
}
