
const timeFormat = (minutes)=>{
    const hours= Math.floor(minutes/60);
    const minutesRemaider = minutes % 60;
    return `${hours}h ${minutesRemaider}m`
}

export default timeFormat;