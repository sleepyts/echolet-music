export const SliderStyles = {
    width: '100%',
    '& .MuiSlider-track': {
        border: 'none',
        borderRadius: 2,
    },
    '& .MuiSlider-rail': {
        opacity: 0.3,
        borderRadius: 2,
    },
    '&:hover .MuiSlider-thumb': {
        width: 6,
        height: 6,
    },
    '& .MuiSlider-thumb': {
        width: 0,
        height: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.3s ease',
        '&:hover, &.Mui-focusVisible, &.Mui-active': {
            width: 6,
            height: 6,
            boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        },
        '&::before': {
            display: 'none',
        },
    },
}
export const getTransformScaleStyles = (scale = 0.9,time=0.1) => ({
    transition: `transform ${time}s ease-in-out`,
    '&:active': {
        transform: `scale(${scale})`,
    },
});