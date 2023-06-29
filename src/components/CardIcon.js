import PoolIcon from '@mui/icons-material/Pool';
import CropFreeIcon from '@mui/icons-material/CropFree';
import SmsFailed from '@mui/icons-material/SmsFailed';
import SchoolIcon from '@mui/icons-material/School';
import SportsGymnasticsIcon from '@mui/icons-material/SportsGymnastics';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

export default function CardIcon({type}) {

    let IconComponent = SmsFailed;
    switch( type) {
        case 'open':
            IconComponent = CropFreeIcon;
            break;
        case 'team':
            IconComponent = PoolIcon;
            break;
        case 'programming':
            IconComponent = SchoolIcon;
            break;
        case 'aerobics':
            IconComponent = SportsGymnasticsIcon;
            break;
        case 'ballet':
            IconComponent = Diversity1Icon;
            break;
        case 'family':
            IconComponent = FamilyRestroomIcon;
            break;
        default:
    }

    return(
        <IconComponent />
    )
}