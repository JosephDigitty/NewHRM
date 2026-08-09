

const SubTitle = ({text,className, textSize='md:text-3xl text-2xl'}) => {
  return (
    <h1 className={`${textSize} font-bold ${className}`}>{text}</h1>
  )
}

export default SubTitle