import { cn } from '@/utils/style';
import { ComponentPropsWithRef, ElementType, createElement } from 'react';
import { IconType } from 'react-icons';

type IconButtonProps<Component extends ElementType> =
    ComponentPropsWithRef<Component> & {
        Icon: IconType;
        iconClassname?: string;
        className?: string;
        component?: Component;
        label: string;

    };

const IconButton = <Component extends ElementType = 'button'>({
    component,
    className,
    iconClassname,
    Icon,
    ...props
}: IconButtonProps<Component>) => {
    return createElement(
        component ?? 'button',
        {
            className: cn('p-1.5 lg:p-2', className),
            'data-cy': props.label,
            ...props,
        },

        <Icon
            className={cn(
                'h-5 w-5 transition-all lg:h-6 lg:w-6',
                iconClassname,
            )}
        />,
    );
};

export default IconButton;
