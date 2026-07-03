const records = [
    {
        id: 1,
        type: 'General Checkup',
        date: '2024-01-01T11:11:11Z',
        doctorId: '1234567890',
        status: 'Completed',
        patientId: '1234567890'
    }
]

export const getRecord = async () => {
    return records;
}
