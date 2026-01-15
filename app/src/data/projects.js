export const projects = [
    {
        id: 1,
        title: '602 Appleby Line',
        category: 'Renovation',
        location: 'Burlington, ON',
        description: 'Complete transformation of a mid-century home into a modern masterpiece. This project involved a full gut renovation of the main floor, creating an open-concept living space perfect for entertaining. We updated the kitchen with custom cabinetry, quartz countertops, and high-end appliances. The flooring was replaced with wide-plank engineered hardwood throughout. We also modernized the lighting plan to creating a warm and inviting atmosphere.',
        mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
        comparisons: [
            {
                label: "Main Living Area",
                before: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop', // Dated interior
                after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop' // Modern interior
            },
            {
                label: "Kitchen Layout",
                before: 'https://images.unsplash.com/photo-1556912172-45b7abe8d7e1?q=80&w=800&auto=format&fit=crop', // Older kitchen style
                after: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop' // Modern kitchen
            }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
        ]
    },
    {
        id: 2,
        title: '76 Roxborough Lane',
        category: 'Construction',
        location: 'Thornhill, ON',
        description: 'A new build project focusing on sustainable luxury. This custom home features geothermal heating, triple-pane windows, and a high-performance envelope. The interior design blends contemporary aesthetics with natural materials, creating a serene and sophisticated environment. Key features include a floating staircase, a chef\'s kitchen, and a spa-like primary ensuite.',
        mainImage: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=1200&auto=format&fit=crop', // Modern Luxury Home Exterior
        comparisons: [
            {
                label: "Site Transformation",
                before: 'https://images.unsplash.com/photo-1599709949699-23136202f37c?q=80&w=800&auto=format&fit=crop', // Construction framing
                after: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=800&auto=format&fit=crop'
            }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1600607687920-f4b5889ac74f?q=80&w=1200&auto=format&fit=crop', // Bathroom
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop' // Living Room
        ]
    },
    {
        id: 3,
        title: '33 Baymark Road',
        category: 'Renovation',
        location: 'Markham, ON',
        description: 'Basement finishing project that added over 1000 sq ft of living space. We created a large recreation room, a home theater, a guest bedroom, and a full bathroom. The design maximized ceiling height and natural light, making the basement feel like an extension of the main floor rather than a secondary space.',
        mainImage: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop', // Cozy basement/living space
        comparisons: [
            {
                label: "Recreation Room",
                before: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop', // Unfinished basement / storage
                after: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'
            }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1593604340977-dd266718d070?q=80&w=1200&auto=format&fit=crop', // Home theater setup
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200&auto=format&fit=crop' // Another angle
        ]
    }
];
