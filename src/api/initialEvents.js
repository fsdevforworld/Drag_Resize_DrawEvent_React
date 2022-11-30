const initialEvents = [
    {
        // This event starts at 0s and ends at 2s (duration: 2s)
        id: '5dec1ba4-05ee-11ec-89a4-88e9fe6854f2',
        start: 0,
        duration: 2
    },
    {
        // This event starts at 6s and ends at 7s (duration: 1s)
        id: '63a81dcc-05ee-11ec-89a4-88e9fe6854f2',
        start: 6,
        duration: 1
    }
];


export const getEventsFromApi = () => {
    return initialEvents;
};
